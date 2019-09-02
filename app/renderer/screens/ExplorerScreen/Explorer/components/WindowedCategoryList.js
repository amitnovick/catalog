import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { FixedSizeList as WindowedList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import CategoryListItem from './CategoryListItem';

const ITEM_SIZE = 50; // TODO: Reuse this constant on `CategoryListItem`

const Row = ({ category, style, hasSelectedRow, selectedCategoryRow, onClickRow }) => {
  return (
    <div style={{ ...style, pointerEvents: 'auto' }}>
      <CategoryListItem
        category={category}
        isSelected={
          hasSelectedRow && selectedCategoryRow !== null && selectedCategoryRow.id === category.id
        }
        onClickRow={onClickRow}
      />
    </div>
  );
};

const WindowedCategoryList = ({
  categories,
  hasSelectedRow,
  selectedCategoryRow,
  onClickRow,
  listRef,
}) => {
  return (
    <>
      {categories.length > 0 ? (
        <AutoSizer>
          {({ width, height }) => (
            <WindowedList
              ref={listRef}
              className="List"
              height={height}
              width={width}
              itemCount={categories.length}
              itemSize={ITEM_SIZE}
              style={{ padding: categories.length === 0 ? '0.5em' : 0 }}>
              {({ index, style }) => (
                <Row
                  category={categories[index]}
                  style={style}
                  hasSelectedRow={hasSelectedRow}
                  selectedCategoryRow={selectedCategoryRow}
                  onClickRow={onClickRow}
                />
              )}
            </WindowedList>
          )}
        </AutoSizer>
      ) : (
        <div style={{ padding: '0.5em' }}>
          <Message info>
            <Message.Header>No Categories</Message.Header>
          </Message>
        </div>
      )}
    </>
  );
};

WindowedCategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  hasSelectedRow: PropTypes.bool.isRequired,
  selectedCategoryRow: PropTypes.object,
  onClickRow: PropTypes.func.isRequired,
  listRef: PropTypes.any.isRequired,
};

export default WindowedCategoryList;
