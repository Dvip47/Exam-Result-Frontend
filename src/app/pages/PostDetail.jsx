import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPostBySlug } from '../services/api';
import { formatDate } from '../utils/helpers';
import { DataContext } from '../App';

export default function PostDetail() {
    const { slug } = useParams();
    const initialData = useContext(DataContext);

    const serverPost = (initialData && !Array.isArray(initialData) && initialData.slug === slug) ? initialData : null;

    const [post, setPost] = useState(serverPost);
    const [loading, setLoading] = useState(!serverPost);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!serverPost) {
            loadPost();
        }
    }, [slug]);

    const loadPost = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostBySlug(slug);
            setPost(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Post not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error || !post) return <div className="text-center py-8 text-red-600">{error || 'Post not found'}</div>;

    const postDate = post.postDate ? formatDate(post.postDate) : 'N/A';
    const lastDate = post.lastDate ? formatDate(post.lastDate) : 'N/A';

    return (
        <>
            <Helmet>
                <title>{post.metaTitle || post.title} - Daily Exam Result</title>
                <meta name="description" content={post.metaDescription || post.shortDescription} />
            </Helmet>

            <div className="main-container">
                {/* 1. Top Header */}
                <div className="sarkari-header">
                    {post.title}
                </div>

                {/* 2. Sub-info */}
                <div className="text-center mb-4">
                    <p><strong>Post Date: </strong> {postDate} | <strong>Last Date: </strong> {lastDate}</p>
                    {post.shortDescription && <p className="mt-2">{post.shortDescription}</p>}
                </div>

                {/* 3. Promo Link (Mock) */}
                <div className="text-center mb-4">
                    <a href="#" className="download-link" style={{ color: 'red' }}>Download Daily Exam Result App Now</a>
                </div>


                {/* 4. Main Details Box (Red Border) */}
                <div className="sarkari-box">
                    <div className="sarkari-box-header">
                        {post.organization} <br />
                        {post.title}
                    </div>

                    <div className="sarkari-sub-header" style={{ marginTop: '10px' }}>
                        <a href="https://dailyexamresult.com" style={{ color: 'blue' }}>DailyExamResult.Com</a>
                    </div>


                    {/* 5. Two Column Info Grid (Dates & Fees) */}
                    <div className="info-grid">
                        <div className="info-col">
                            <h3 className="col-header">Important Dates</h3>
                            <ul>
                                <li><strong>Application Begin : </strong> {post.postDate ? formatDate(post.postDate) : 'N/A'}</li>
                                <li><strong>Last Date for Apply Online : </strong> <span style={{ color: 'red' }}>{lastDate}</span></li>
                                {post.importantDates && post.importantDates.map((d, i) => (
                                    <li key={i}><strong>{d.label} : </strong> {d.date ? formatDate(d.date) : 'N/A'}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="info-col">
                            <h3 className="col-header">Application Fee</h3>
                            <ul>
                                <li><strong>General / OBC / EWS : </strong> {post.fees || '0'}</li>
                                <li><strong>SC / ST : </strong> 0</li>
                                <li className="mt-2"><strong>Payment Mode : </strong> {post.paymentMode || 'Debit Card, Credit Card, Net Banking'}</li>
                            </ul>
                        </div>
                    </div>

                    {/* 6. Age Limit & Vacancy Header */}
                    <div className="sarkari-green-header" style={{ marginTop: '0' }}>
                        {post.title} : Age Limit as on {new Date().getFullYear()}
                    </div>

                    <div className="info-grid" style={{ borderTop: 'none' }}>
                        <div className="info-col" style={{ borderRight: 'none', textAlign: 'center' }}>
                            <ul>
                                <li><strong>Minimum Age : </strong> {post.minAge || '18'} Years</li>
                                <li><strong>Maximum Age : </strong> {post.maxAge || post.ageLimit || 'NA'} Years</li>
                                <li>Age Relaxation Extra as per Rules</li>
                            </ul>
                        </div>
                    </div>


                    {/* 7. Vacancy Details Table */}
                    <div className="sarkari-orange-header">
                        Vacancy Details Total : {post.totalPosts || 'VARIOUS'} Post
                    </div>

                    <table className="sarkari-table" style={{ marginTop: '0' }}>
                        <thead>
                            <tr>
                                <th>Post Name</th>
                                <th>Total Post</th>
                                <th>Eligibility / Qualification</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{post.title}</td>
                                <td>{post.totalPosts || 'NA'}</td>
                                <td>{post.qualification || 'See Notification'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 8. Full Description / Instructions */}
                    <div className="sarkari-box-header" style={{ backgroundColor: '#0d1f5c' }}>
                        How to Fill Form
                    </div>
                    <div className="p-4" style={{ border: '1px solid #000', borderTop: 'none' }}>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                            <li>Candidate Read the Notification Before Apply the Recruitment Application Form in {post.organization}.</li>
                            <li>Kindly Check and Collect the All Document - Eligibility, ID Proof, Address Details, Basic Details.</li>
                            <li>Kindly Ready Scan Document Related to Recruitment Form - Photo, Sign, ID Proof, Etc.</li>
                            <li>Before Submit the Application Form Must Check the Preview and All Column Carefully.</li>
                            <li>Take A Print Out of Final Submitted Form.</li>
                        </ul>
                    </div>

                    {/* 9. Useful Important Links */}
                    <div className="sarkari-green-header" style={{ marginTop: '20px' }}>
                        Some Useful Important Links
                    </div>

                    <table className="sarkari-table" style={{ marginTop: '0' }}>
                        <tbody>
                            {post.applyLink && (
                                <tr>
                                    <td className="dl-label">Apply Online</td>
                                    <td className="center-text"><a href={post.applyLink} target="_blank" rel="noopener noreferrer" className="post-link-btn">Click Here</a></td>
                                </tr>
                            )}
                            {post.notificationPdf && (
                                <tr>
                                    <td className="dl-label">Download Notification</td>
                                    <td className="center-text"><a href={post.notificationPdf} target="_blank" rel="noopener noreferrer" className="post-link-btn">Click Here</a></td>
                                </tr>
                            )}
                            {post.syllabusPdf && (
                                <tr>
                                    <td className="dl-label">Download Syllabus</td>
                                    <td className="center-text"><a href={post.syllabusPdf} target="_blank" rel="noopener noreferrer" className="post-link-btn">Click Here</a></td>
                                </tr>
                            )}
                            <tr>
                                <td className="dl-label">Official Website</td>
                                <td className="center-text"><a href="https://dailyexamresult.com" target="_blank" rel="noopener noreferrer" className="post-link-btn">Click Here</a></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                {/* End Sarkari Box */}

            </div>
        </>
    );
}
