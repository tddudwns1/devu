import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate'
import './studies.css'
import Submenu from './Submenu'
import a from "../../../img/a.png"
import magnify from "../../../img/magnify.png"
import Footer from '../../Home/Footer'
import spring from "../../../img/spring.png"
import c from "../../../img/c.png"
import cpp from "../../../img/cpp.png"
import js from "../../../img/js.png"
import react from "../../../img/react.png"
import node_js from "../../../img/node_js.png"
import python from "../../../img/python.png"
import go from "../../../img/go.png"
import swift from "../../../img/swift.png"
import angular from "../../../img/angular.png"
import java from "../../../img/java.png"
import flutter from "../../../img/flutter.png"
import docker from "../../../img/docker.png"
import ruby from "../../../img/ruby.png"
import html from "../../../img/html.png"
import css from "../../../img/css.png"
import mysql from "../../../img/mysql.png"
import comment from "../../../img/comment.png"
import hit from "../../../img/hit.png"
import like from "../../../img/like.png"
import { Link } from 'react-router-dom';

const Studies = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [postSize, setPostSize] = useState(0);
    const [postsPerPage] = useState(20);
    const [postData, setPostData] = useState([]);
    const [lastIdx, setLastIdx] = useState(0);
    const [selectedTag, setSelectedTag] = useState([]);
    const [sentence, setSentence] = useState('');
    const [status, setStatus] = useState('');
    const [order, setOrder] = useState('');
    const onChangeSentence = (e) => { setSentence(e.target.value); }

    useEffect(() => {
        fetchData();
        fetchPageSize();
    }, [currentPage, selectedTag, status, order]);

    const fetchData = async () => {
        const res = await axios.get(process.env.REACT_APP_DB_HOST + `/community/studies`, {
            params: {
                page: currentPage,
                tags: selectedTag.join(","), // join(",")으로 해야 ?tags=REACT,SPRING으로 parameter 전송할 수 있음.
                s: sentence,
                status: status,
                order: order,
            },
        });

        const _postData = await res.data.map(
            (rowData) => (
                setLastIdx(lastIdx + 1),
                {
                    id: rowData.id,
                    title: rowData.title,
                    content: (rowData.content),
                    hit: rowData.hit,
                    like: rowData.like,
                    username: rowData.username,
                    tags: rowData.tags,
                    studyStatus: rowData.studyStatus,
                    commentsSize: rowData.commentsSize,
                }
            )
        );
        setPostData(_postData);
    };


    const handleTags = (tag) => {
        const _selectedTag = [...selectedTag];
        if (!_selectedTag.includes(tag)) {
            _selectedTag.push(tag);
        }
        setSelectedTag(_selectedTag);
    }

    const fetchPageSize = async () => {
        const res = await axios.get(process.env.REACT_APP_DB_HOST + `/community/studies/size`);
        setPostSize(res.data);
    }

    const changePage = ({ selected }) => {
        setCurrentPage(selected)
    }


    return (
        <div>
            <Submenu />
            <div className='all-studies'>
                <div className='top-studies'>
                    <h3 className='top-msg'>따끈따끈한 구인란이에요!</h3>
                    <h4 className='top-msg-gray'>함께 성장할 스터디를 모집해보세요</h4>
                    {/* 상위 3개 게시물 */}
                    <div className='list-topcards'>
                        {postData.slice(0, 3).map(top => (
                            <li key={top.id} className="top-cards">
                                <div className='top-card'>
                                    <div className='top-circle'>
                                        <div className='top-profile'>
                                            <img className="top-photo" src={a} alt="" />
                                        </div>
                                        <div className='top-detail'>
                                            <div className='top-title'>{top.title}</div>
                                            <div className='top-content'>{top.content}</div>
                                            <div className='top-date'>방금 전</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
                <div className='body-studies'>
                    <div className='cat-menu'>
                        <div className='cat-menu-items'>
                            <p className='cat-item' onClick={() => { setStatus(''); }}>전체</p>
                            <p className='cat-item' onClick={() => { setStatus('ACTIVE') }}>모집중</p>
                            <p className='cat-item' onClick={() => { setStatus('CLOSED') }}>모집완료</p>
                        </div>
                    </div>
                    <div className='search-and-write'>
                        <div className='studies-search'>
                            <input type='text' placeholder='맞춤 스터디그룹을 찾아보세요' className='search-input' onChange={(e) => { onChangeSentence(e); }} />
                            <button className='btn-mag' onClick={() => { fetchData(); }}>
                                <img className='img-mag' src={magnify} alt="" />
                            </button>
                        </div>
                        <Link to="write">
                            <button className='btn-studies-write'>글쓰기</button>
                        </Link>
                    </div>
                    <div className='choicing'>
                        <div className='choice-tag'>
                            <button className='btn-choice' onClick={() => { handleTags("Spring") }}>
                                <img className='img-choice' src={spring} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("C") }}>
                                <img className='img-choice' src={c} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("CPP") }}>
                                <img className='img-choice' src={cpp} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("JavaScript") }}>
                                <img className='img-choice' src={js} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("React") }}>
                                <img className='img-choice' src={react} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("NodeJS") }}>
                                <img className='img-choice' src={node_js} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Python") }}>
                                <img className='img-choice' src={python} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Go") }}>
                                <img className='img-choice' src={go} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Swift") }}>
                                <img className='img-choice' src={swift} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Angular") }}>
                                <img className='img-choice' src={angular} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Java") }}>
                                <img className='img-choice' src={java} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Flutter") }}>
                                <img className='img-choice' src={flutter} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Docker") }}>
                                <img className='img-choice' src={docker} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("Ruby") }}>
                                <img className='img-choice' src={ruby} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("HTML") }}>
                                <img className='img-choice' src={html} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("CSS") }}>
                                <img className='img-choice' src={css} alt="" />
                            </button>
                            <button className='btn-choice' onClick={() => { handleTags("MySQL") }}>
                                <img className='img-choice' src={mysql} alt="" />
                            </button>
                        </div>
                        <div className='body-content'>
                            <select className='select-studies' onChange={(e) => { setOrder(e.target.value); }}>
                                <option value="">최신순</option>
                                <option value="likes">인기순</option>
                                <option value="comments">댓글순</option>
                            </select>
                            <div className='studies-line'></div>
                            {/* 게시물 미리보기 */}
                            {postData.slice(0, 20).map(post => (
                                <li key={post.id} className="list-studies">
                                    <div className='post-studies'>
                                        <div className='post-header'>
                                            <div className='post-status'>{post.studyStatus === 'ACTIVE' ? '모집중' : '모집완료'}</div>
                                            <div className='post-title'>
                                                <Link to={`/studiesDetail/${post.id}`}>{post.title}</Link>
                                            </div>
                                        </div>
                                        <div className='post-body'>
                                            <div className='post-content'>{post.content}
                                            </div>
                                            <div className='post-options'>
                                                <div className='post-comment'>
                                                    <img className="img-comment" src={comment} alt='' />
                                                    <div className='text-comment'>
                                                        {post.commentsSize}
                                                    </div>
                                                </div>
                                                <div className='post-hit'>
                                                    <img className="img-hit" src={hit} alt='' />
                                                    <div className='text-hit'>{post.hit}</div>
                                                </div>
                                                <div className='post-like'>
                                                    <img className="img-like" src={like} alt='' />
                                                    <div className='text-like'>{post.like}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='tags'>
                                            {post.tags.map(tag => (
                                                <div className='post-tag'>{tag}</div>
                                            ))}
                                        </div>
                                        <div className='post-tail'>
                                            <div className='post-owner'>{post.username}</div>
                                            <div className='post-date'>1분 전</div>
                                        </div>
                                        <div className='studies-line'></div>
                                    </div>
                                </li>
                            ))}
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                pageCount={Math.ceil(postSize / postsPerPage)} // 페이지 버튼 개수 출력하는 부분 -> 글 전체 개수 넘겨받아서 사용해야함
                                onPageChange={changePage}
                                containerClassName={"btn-pagination"}
                                previousLinkClassName={"btn-pagination-previous"}
                                nextLinkClassName={"btn-pagination-next"}
                                disabledClassName={"btn-pagination-disabled"}
                                activeClassName={"btn-pagination-active"}
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Studies