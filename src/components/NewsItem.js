import React from 'react'

const NewsItem = (props)=> {
        let { title, description, imageUrl, newsUrl, author, date, source } = props;
        const fallbackImage = "https://dummyimage.com/300x225/cccccc/969696?text=No+Image";
        
        const handleImageError = (e) => {
            e.target.src = fallbackImage;
        }

        return (
            <div className="my-3">
                <div className="card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        right: '0'
                    }}>
                        <span className="badge rounded-pill bg-success">{source}</span>
                    </div>
                    <img src={imageUrl || fallbackImage} onError={handleImageError} className="card-img-top" alt="News" />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}...</p>
                        <p className="card-text"><small className="text-danger">By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}</small></p>
                        <a rel="noreferrer" href={newsUrl} className="btn btn-sm" style={{ backgroundColor: "#6f42c1", color: "white" }}>Read More..</a>
                    </div>
                </div>
            </div>
        )

}

export default NewsItem
