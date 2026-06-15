import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [error, setError] = useState(null)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async ()=> {
        props.setProgress(10);
        // Test by fetching global top headlines instead of filtering by country
        const url = `https://newsapi.org/v2/top-headlines?category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        setError(null);

        try {
            let data = await fetch(url);
            props.setProgress(30);
            let parsedData = await data.json();
            props.setProgress(70);

            if (parsedData.status !== 'ok') {
                setError(parsedData.message || 'Failed to load news.');
                setArticles([]);
                setTotalResults(0);
            } else {
                setArticles(parsedData.articles || []);
                setTotalResults(parsedData.totalResults || 0);
            }
        } catch (err) {
            setError(err.message || 'Failed to load news.');
            setArticles([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
            props.setProgress(100);
        }
    }

    useEffect(()=> {
        document.title = `NewsWeb-${capitalizeFirstLetter(props.category)}`;
        updateNews();
        // eslint-disable-next-line
    }, [])

    // const handlePrevClick = async () => {
    //     setPage(page-1)
    //     updateNews();
    // }

    // const handleNextClick = async () => {
    //     setPage(page+1)
    //     updateNews();

    // }

    const fetchMoreData = async() => {
        setError(null);
        const nextPage = page + 1;
        // Test by fetching global top headlines instead of filtering by country
        const url = `https://newsapi.org/v2/top-headlines?category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

        try {
            let data = await fetch(url);
            let parsedData = await data.json();

            if (parsedData.status === 'ok') {
                setArticles(articles.concat(parsedData.articles || []));
                setTotalResults(parsedData.totalResults || totalResults);
                setPage(nextPage);
            } else {
                setError(parsedData.message || 'Failed to load more news.');
            }
        } catch (err) {
            setError(err.message || 'Failed to load more news.');
        }
      };

        return (
            <>
                <h1 className="text-center" style={{ margin: '30px 0px', marginTop: '90px' }}>NewsWeb - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                {!loading && !error && articles.length === 0 && (
                    <div className="alert alert-warning text-center" role="alert">
                        No news articles were returned for {capitalizeFirstLetter(props.category)} in {props.country.toUpperCase()}.
                    </div>
                )}
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                >

                    <div className="container">

                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title.slice(0, 76) : ""} description={element.description ? element.description.slice(0, 100) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>

                    </div>

                </InfiniteScroll>
            </>
        )
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string,
    setProgress: PropTypes.func
}

export default News
