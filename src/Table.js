import React from 'react';
import Button from './Button';
import {sortBy} from 'lodash';
import classNames from 'classnames';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({sortKey, activeSortKey, onSort, children}) => {
  const sortClass = classNames('button-inline', {
    'button-active': activeSortKey === sortKey,
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};

const Table = ({list, sortKey, isSortReverse, onSort, onDismiss}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{width: '40%'}}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>
            {' '}
            Title
          </Sort>
        </span>
        <span style={{width: '30%'}}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>
            Author
          </Sort>
        </span>
        <span style={{width: '10%'}}>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>
            Comments
          </Sort>
        </span>
        <span style={{width: '10%'}}>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>
            {' '}
            Points
          </Sort>
        </span>
        <span style={{width: '10%'}}>Archive</span>
      </div>
      {reverseSortedList.map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={{width: '40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
              <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Table;
