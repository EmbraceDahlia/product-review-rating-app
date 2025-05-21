import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import StarRating from '../components/StarRating';
import type { Review } from '../types';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { product, reviews, loading, error: contextError, fetchProductAndReviews, addReview, deleteReview } = useProduct();

    const [newReview, setNewReview] = useState({
        author: '',
        rating: 0,
        comment: '',
    });
    
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProductAndReviews(parseInt(id));
        }
    }, [id, fetchProductAndReviews]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewReview((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newReview.author || !newReview.comment || newReview.rating === 0) {
            setError('Please fill in all fields.');
            return;
        }

        const reviewData: Review = {
            id: 0,
            productId: product?.id ?? 0,
            author: newReview.author,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString()
        };

        await addReview(reviewData);
        if (product?.id) {
            await fetchProductAndReviews(product.id);
        }
        await
            setNewReview({ author: '', rating: 0, comment: '' });
        setError(null);
    };

    const handleDeleteReview = async (reviewId: number) => {
        await deleteReview(reviewId);
        if (product?.id) {
            await fetchProductAndReviews(product.id);
        }
    };

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;
    if (contextError) return <div className="alert alert-danger">{contextError}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product?.imageUrl} alt={product?.name} className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <h1>{product?.name}</h1>
                    <p>{product?.description}</p>
                    <p><strong>Price:</strong> ${product?.price}</p>
                    <p><strong>Category:</strong> {product?.category}</p>
                    <div>
                        <strong>Rating:</strong> {product?.averageRating ? (Number(product.averageRating) || 0).toFixed(1) : 'Not Rated'} / 5
                        {product && <StarRating rating={Number(product.averageRating) || 0} />}
                    </div>
                </div>
            </div>

            <h2 className="mt-5">Add a Review</h2>
            <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                    <label htmlFor="author" className="form-label">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        id="author"
                        name="author"
                        value={newReview.author}
                        onChange={handleInputChange}
                        placeholder="Your name"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <select
                        className="form-select"
                        id="rating"
                        name="rating"
                        value={newReview.rating}
                        onChange={handleInputChange}
                    >
                        <option value="0">Select a rating</option>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating} Star{rating > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                        className="form-control"
                        id="comment"
                        name="comment"
                        value={newReview.comment}
                        onChange={handleInputChange}
                        placeholder="Write your review"
                    ></textarea>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary">
                    Submit Review
                </button>
            </form>

            <h2 className="mt-5">Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{review.author}</h5>
                            <p className="card-text">{review.comment}</p>
                            <div className="card-text">
                                <small className="text-muted">
                                    Rating: {review.rating} / 5
                                    <div style={{ display: 'inline-block' }}>
                                        <StarRating rating={review.rating} />
                                    </div>
                                </small>
                            </div>

                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteReview(review.id)}
                            >
                                Delete Review
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductPage;
