export const format = {
  columns: [
    "Region",
    "Country",
    "Item Type",
    "Sales Channel",
    "Order Priority",
    "Order Date",
    "Order ID",
    "Ship Date",
    "Units Sold",
    "Unit Price",
    "Unit Cost",
    "Total Revenue",
    "Total Cost",
    "Total Profit"
  ],
  dataTypes: {
    Region: "object/categorical",
    Country: "object/categorical",
    "Item Type": "object/categorical",
    "Sales Channel": "object/categorical",
    "Order Priority": "object/categorical",
    "Order Date": "object/categorical",
    "Order ID": "int64/numerical",
    "Ship Date": "object/categorical",
    "Units Sold": "int64/numerical",
    "Unit Price": "float64/numerical",
    "Unit Cost": "float64/numerical",
    "Total Revenue": "float64/numerical",
    "Total Cost": "float64/numerical",
    "Total Profit": "float64/numerical"
  },
  shape: {
    rows: 100,
    columns: 14
  },
  missing: {
    Region: 0,
    Country: 0,
    "Item Type": 0,
    "Sales Channel": 0,
    "Order Priority": 0,
    "Order Date": 0,
    "Order ID": 0,
    "Ship Date": 0,
    "Units Sold": 0,
    "Unit Price": 0,
    "Unit Cost": 0,
    "Total Revenue": 0,
    "Total Cost": 0,
    "Total Profit": 0
  },
  mean: {
    "Order ID": 518952915.14,
    "Units Sold": 5254.74,
    "Unit Price": 257.9803,
    "Unit Cost": 184.6473,
    "Total Revenue": 1373005.6261000005,
    "Total Cost": 985112.2513000001,
    "Total Profit": 387893.3748
  },
  median: {
    "Order ID": 494079267.5,
    "Units Sold": 5291.0,
    "Unit Price": 154.06,
    "Unit Cost": 97.44,
    "Total Revenue": 686610.02,
    "Total Cost": 404692.755,
    "Total Profit": 246792.25
  },
  mode: {
    Region: "Sub-Saharan Africa",
    Country: "Montenegro",
    "Item Type": "Office Supplies",
    "Sales Channel": "Online",
    "Order Priority": "M",
    "Order Date": "5/17/2012",
    "Ship Date": "4/17/2015"
  }
};
