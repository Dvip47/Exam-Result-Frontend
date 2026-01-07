import { fetchPostBySlug, fetchPosts } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import JsonLd from '../../components/JsonLd';

export const revalidate = 60; // ISR 60 seconds

export async function generateStaticParams() {
    const data = await fetchPosts({ limit: 100 }); // Pre-render latest 100 posts
    return (data.posts || []).map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const post = await fetchPostBySlug(slug);

    if (!post) return { title: 'Post Not Found - Daily Exam Result' };

    const title = post.metaTitle || post.title;
    const desc = post.metaDescription || post.shortDescription || `Apply for ${post.title} at ${post.organization}. Get latest details on eligibility, fees, and important dates at Daily Exam Result.`;

    return {
        title: title.length > 60 ? title.substring(0, 57) + '...' : title,
        description: desc.length > 160 ? desc.substring(0, 157) + '...' : desc,
        alternates: {
            canonical: `https://dailyexamresult.com/post/${slug}`,
        },
    };
}

export default async function PostDetailPage({ params }) {
    const { slug } = params;
    const post = await fetchPostBySlug(slug);

    if (!post) {
        return <div className="text-center py-8 text-red-600">Post not found</div>;
    }

    const postDate = post.postDate ? formatDate(post.postDate) : 'N/A';
    const lastDate = post.lastDate ? formatDate(post.lastDate) : 'N/A';

    // Structured Data
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": post.title,
        "datePosted": post.postDate || post.createdAt,
        "validThrough": post.lastDate,
        "hiringOrganization": {
            "@type": "Organization",
            "name": post.organization || "Govt Jobs",
            "sameAs": "https://dailyexamresult.com"
        },
        "jobLocationType": "TELECOMMUTE",
        "description": post.educationalQualification ? `${post.educationalQualification}\n\n${post.shortDescription || post.title}` : (post.shortDescription || post.title),
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
                "@type": "QuantitativeValue",
                "value": post.fees || 0,
                "unitText": "INR"
            }
        }
    };

    return (
        <div className="main-container">
            <JsonLd data={structuredData} />
            {/* 1. Top Header */}
            <h1 className="sarkari-header" style={{ fontSize: '24px', margin: '15px 0' }}>
                {post.title}
            </h1>

            {/* 2. Sub-info */}
            <div className="text-center mb-4">
                <p><strong>Post Date: </strong> {postDate} | <strong>Last Date: </strong> {lastDate}</p>
                {post.shortDescription && <p className="mt-2 text-sm">{post.shortDescription}</p>}
            </div>

            {/* 3. Promo Link (Mock) */}
            <div className="text-center mb-4">
                <a href="#" className="download-link" style={{ color: 'red' }}>Download Daily Exam Result App Now</a>
            </div>

            {/* 4. Main Details Box (Red Border) - SARKARI CLASSIC THEME */}
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
                            <li className="mt-2 text-red-600"><strong>Payment Mode : </strong> {post.paymentMode || 'Debit Card, Credit Card, Net Banking'}</li>
                        </ul>
                    </div>
                </div>

                {/* 6. Age Limit Section */}
                <div className="sarkari-green-header" style={{ marginTop: '0' }}>
                    {post.title} : Age Limit as on {new Date().getFullYear()}
                </div>
                <div className="info-grid" style={{ borderTop: 'none', textAlign: 'center' }}>
                    <div className="info-col" style={{ borderRight: 'none', width: '100%' }}>
                        <ul>
                            <li><strong>Minimum Age : </strong> {post.minAge || '18'} Years</li>
                            <li><strong>Maximum Age : </strong> {post.maxAge || post.ageLimit || 'NA'} Years</li>
                            <li>Age Relaxation Extra as per Rules</li>
                        </ul>
                    </div>
                </div>

                {/* New Structured Sections */}
                {post.educationalQualification && (
                    <>
                        <div className="sarkari-orange-header">
                            Educational Qualification
                        </div>
                        <div className="p-4 bg-white border border-gray-900 border-t-0 text-center font-bold">
                            {post.educationalQualification}
                        </div>
                    </>
                )}

                {post.categoryWiseVacancy && post.categoryWiseVacancy.length > 0 && (
                    <>
                        <div className="sarkari-orange-header">
                            Vacancy Details (Category-Wise)
                        </div>
                        <table className="sarkari-table" style={{ marginTop: '0' }}>
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Total Post</th>
                                </tr>
                            </thead>
                            <tbody>
                                {post.categoryWiseVacancy.map((v, i) => (
                                    <tr key={i}>
                                        <td>{v.category}</td>
                                        <td>{v.totalPosts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {post.postWiseVacancy && post.postWiseVacancy.length > 0 && (
                    <>
                        <div className="sarkari-orange-header">
                            Post-Wise Vacancy Distribution
                        </div>
                        <table className="sarkari-table" style={{ marginTop: '0' }}>
                            <thead>
                                <tr>
                                    <th>Post Name</th>
                                    <th>Total Post</th>
                                </tr>
                            </thead>
                            <tbody>
                                {post.postWiseVacancy.map((v, i) => (
                                    <tr key={i}>
                                        <td>{v.postName}</td>
                                        <td>{v.totalPosts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

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

                {post.physicalStandardTest && (post.physicalStandardTest.male?.length > 0 || post.physicalStandardTest.female?.length > 0) && (
                    <>
                        <div className="sarkari-orange-header">
                            Physical Standard Test (PST)
                        </div>
                        {post.physicalStandardTest.male?.length > 0 && (
                            <table className="sarkari-table" style={{ marginTop: '0' }}>
                                <thead>
                                    <tr>
                                        <th colSpan="3" style={{ backgroundColor: '#0d1f5c' }}>Male Candidates</th>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <th>Height</th>
                                        <th>Chest</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.physicalStandardTest.male.map((v, i) => (
                                        <tr key={i}>
                                            <td>{v.category}</td>
                                            <td>{v.height}</td>
                                            <td>{v.chest || 'NA'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {post.physicalStandardTest.female?.length > 0 && (
                            <table className="sarkari-table" style={{ marginTop: '0' }}>
                                <thead>
                                    <tr>
                                        <th colSpan="3" style={{ backgroundColor: '#0d1f5c' }}>Female Candidates</th>
                                    </tr>
                                    <tr>
                                        <th>Category</th>
                                        <th>Height</th>
                                        <th>Min Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.physicalStandardTest.female.map((v, i) => (
                                        <tr key={i}>
                                            <td>{v.category}</td>
                                            <td>{v.height}</td>
                                            <td>{v.minWeight || 'NA'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {post.physicalEfficiencyTest && post.physicalEfficiencyTest.length > 0 && (
                    <>
                        <div className="sarkari-orange-header">
                            Physical Efficiency Test (PET)
                        </div>
                        <table className="sarkari-table" style={{ marginTop: '0' }}>
                            <thead>
                                <tr>
                                    <th>Category / Activity</th>
                                    <th>Distance</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {post.physicalEfficiencyTest.map((v, i) => (
                                    <tr key={i}>
                                        <td>{v.category}</td>
                                        <td>{v.distance}</td>
                                        <td>{v.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

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
        </div >
    );
}
