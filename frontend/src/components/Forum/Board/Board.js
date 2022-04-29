import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './board.css';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'html-react-parser';
import Posts from './Posts';
import ReactPaginate from 'react-paginate'
import './pagination.css'

const Board = () => {
  const [currentPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [postData, setPostData] = useState([]);
  const [lastIdx, setLastIdx] = useState(0);

  const [pageNumber, setPageNumber] = useState(0)
  const pagesVisited = pageNumber * postsPerPage

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`/community/chats`, {
      params: {
        page: currentPage,
      },
    });

    const _postData = await res.data.map(
      (rowData) => (
        setLastIdx(lastIdx + 1),
        {
          id: rowData.id,
          title: rowData.title,
          content: ReactHtmlParser(rowData.content),
          hit: rowData.hit,
          like: rowData.like,
          username: rowData.username,
        }
      )
    );
    setPostData(_postData);
  };

  const pageCount = Math.ceil(postData.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  return (
    <div>
      {/* 게시판 */}
      <div className="content">
        <div className="article-list">
          <Posts postData={postData} pagesVisited={pagesVisited} postsPerPage={postsPerPage} />
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"btn-pagination"}
            previousLinkClassName={"btn-pagination-previous"}
            nextLinkClassName={"btn-pagination-next"}
            disabledClassName={"btn-pagination-disabled"}
            activeClassName={"btn-pagination-active"}
          />
        </div>
        <Link to="write">
          <button className="btn-write">글 쓰기</button>
        </Link>
      </div>
    </div>
  );
};

export default Board;
