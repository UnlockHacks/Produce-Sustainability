const knex = require("knex")

const SupermarketService = function (data = {}) {
  
  const saveStoresData = async (storeName, storeLocation, itemName, itemPriceSold) => {
    await knex('stores_log').insert({
      store_name: storeName,
      store_location: storeLocation,
      item_name: itemName,
      sold_price_per_unit: itemPriceSold
    });
  };
    
  const getWeeklyAverageAllProducts = (storeName, preTimeLimit, location) => {
    const query = knex('stores_log')
      .select(
        'store_name', 
        knex.raw('MIN(created_at) AS created_at'), 
        'item_name', 
        'store_location', 
        knex.raw('AVG(sold_price_per_unit) AS average_price_per_unit'))
      .where('created_at', '>=', preTimeLimit)
      .where('store_name', '=', storeName)
      .where('store_location', '=', location)
      .groupBy('store_name', 'store_location', 'item_name');

    return query;
  };

  
  const getWeeklyTotalAllProducts = (storeName, preTimeLimit, location) => {
    const query = knex('stores_log')
      .select(
        'store_name', 
        knex.raw('MIN(created_at) AS created_at'), 
        'item_name', 
        'store_location', 
        knex.raw('SUM(sold_price_per_unit) AS average_price_per_unit'))
      .where('created_at', '>=', preTimeLimit)
      .where('store_name', '=', storeName)
      .where('store_location', '=', location)
      .groupBy('store_name', 'store_location', 'item_name');

    return query;
  };

  return {
    saveStoresData, 
    getWeeklyAverageAllProducts,
    getWeeklyTotalAllProducts
  }
};

module.export = SupermarketService;