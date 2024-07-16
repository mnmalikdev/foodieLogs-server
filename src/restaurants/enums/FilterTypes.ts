enum FilterTypes {
  Category = 'category', 
  Price = 'price', 
  Features = 'features', 
  Location = 'location',
}

export interface Filter {
  type: FilterTypes;
  value: string;
}


export enum ItemFilters{
  Favourite = 'favourite',
  Rating = 'rating',
  Alphabetical = 'alphabetical'
}



export enum ItemOrders{
  Ascending = 'ASC',
  Descending = 'DESC'
}



export default FilterTypes;
