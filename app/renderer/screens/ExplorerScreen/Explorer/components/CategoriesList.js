import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { FixedSizeList as WindowedList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import CategoryListItem from './CategoryListItem';
import { CATEGORY_LIST_ITEM_HEIGHT } from './layoutConstants';

const CategoryItemContext = React.createContext();

const Row = ({ index, style, data }) => {
  const category = data[index];

  return (
    <CategoryItemContext.Consumer>
      {({ hasSelectedRow, selectedCategoryRow, onClickRow }) => (
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
      )}
    </CategoryItemContext.Consumer>
  );
};

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
        <CategoryItemContext.Provider
          value={{
            hasSelectedRow: hasSelectedRow,
            selectedCategoryRow: selectedCategoryRow,
            onClickRow: onClickRow,
          }}>
          <AutoSizer>
            {({ width, height }) => (
              <WindowedList
                itemData={categories}
                ref={listRef}
                className="List"
                height={height}
                width={width}
                itemCount={categories.length}
                itemSize={CATEGORY_LIST_ITEM_HEIGHT}
                style={{ padding: categories.length === 0 ? '0.5em' : 0 }}>
                {Row}
              </WindowedList>
            )}
          </AutoSizer>
        </CategoryItemContext.Provider>
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
