import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const searchQuery = queryParams.get('q')?.trim() || ''
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [error, setError] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async (pageNumber = 1) => {
        // Use NewsAPI v2 endpoints
        props.setProgress(10);
        setLoading(true);
        setError(null);
        setIsFetching(true);

        const url = `/api/fetchNews?searchQuery=${encodeURIComponent(searchQuery)}&category=${props.category}&country=${props.country}&pageSize=${props.pageSize}&page=${pageNumber}`;

        try {
            props.setProgress(30);
            const parsedData = await fetchJson(url);
            props.setProgress(70);

            if (parsedData.status && parsedData.status === 'error') {
                setError(parsedData.message || 'Failed to load news.');
                setArticles([]);
                setTotalResults(0);
            } else {
                setArticles(parsedData.articles || []);
                setTotalResults(parsedData.totalResults || 0);
                setPage(pageNumber);
            }
        } catch (err) {
            setError(err.message || 'Failed to load news.');
            setArticles([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
            setIsFetching(false);
            props.setProgress(100);
        }
    }

    useEffect(() => {
        document.title = searchQuery
            ? `NewsSphere - Search: ${capitalizeFirstLetter(searchQuery)}`
            : `NewsSphere-${capitalizeFirstLetter(props.category)}`;
        setPage(1)
        updateNews(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.category, props.country, location.search])

    const fetchMoreData = async () => {
        // guard: don't fetch if already loading or another fetch is active
        if (loading || isFetching) return;
        setError(null);
        const nextPage = page + 1;
        setIsFetching(true);

        const url = `/api/fetchNews?searchQuery=${encodeURIComponent(searchQuery)}&category=${props.category}&country=${props.country}&pageSize=${props.pageSize}&page=${nextPage}`;

        try {
            const parsedData = await fetchJson(url);

            if (parsedData.status && parsedData.status === 'error') {
                setError(parsedData.message || 'Failed to load more news.');
            } else {
                setArticles((prev) => prev.concat(parsedData.articles || []));
                setTotalResults(parsedData.totalResults || totalResults);
                setPage(nextPage);
            }
        } catch (err) {
            setError(err.message || 'Failed to load more news.');
        } finally {
            setIsFetching(false);
        }
    };

    // helper: fetch and ensure response is JSON (avoid HTML index responses)
    const fetchJson = async (url) => {
        const res = await fetch(url, { credentials: 'same-origin' });
        const contentType = res.headers.get('content-type') || '';
        const text = contentType.includes('application/json') ? null : await res.text();

        if (!contentType.includes('application/json')) {
            throw new Error(`Expected JSON response but server returned HTML or plain text. First 200 chars: ${text ? text.slice(0, 200) : ''}`);
        }

        const json = await res.json();
        return json;
    }

    return (
        <>
            <h1 className="heading text-center" style={{ margin: '30px 12px', marginTop: '150px' }}>
                {searchQuery
                    ? `NewsSphere - Search results for "${capitalizeFirstLetter(searchQuery)}"`
                    : `NewsSphere - Top ${capitalizeFirstLetter(props.category)} Headlines`}
            </h1>
            
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
                hasMore={!loading && articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element, index) => {
                            return (
                                // Appended index to the key to guarantee uniqueness in edge cases where url strings match
                                <div className="col-md-4" key={`${element.url}-${index}`}>
                                    <NewsItem 
                                        title={element.title ? element.title.slice(0, 76) : ""} 
                                        description={element.description ? element.description.slice(0, 100) : ""} 
                                        imageUrl={element.urlToImage} 
                                        newsUrl={element.url} 
                                        author={element.author || (element.source ? element.source.name : "Unknown")} 
                                        date={element.publishedAt} 
                                        source={element.source ? element.source.name : "News"} 
                                    />
                                </div>
                            )
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