import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { FixedSizeList as WindowedList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import CategoryListItem from './CategoryListItem';
import { CATEGORY_LIST_ITEM_HEIGHT } from './layoutConstants';

const CategoriesList = ({
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
              itemSize={CATEGORY_LIST_ITEM_HEIGHT}>
              {({ index, style }) => {
                const category = categories[index];
                return (
                  <div
                    style={{
                      ...style,
                      pointerEvents: 'auto',
                    }}>
                    <CategoryListItem
                      category={category}
                      isSelected={
                        hasSelectedRow &&
                        selectedCategoryRow !== null &&
                        selectedCategoryRow.id === category.id
                      }
                      onClickRow={onClickRow}
                    />
                  </div>
                );
              }}
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

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  hasSelectedRow: PropTypes.bool.isRequired,
  selectedCategoryRow: PropTypes.object,
  onClickRow: PropTypes.func.isRequired,
  listRef: PropTypes.any.isRequired,
};

export default CategoriesList;
