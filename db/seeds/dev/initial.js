const fs = require ('fs');

const employeeData = fs.readFile('/employees.tsv', (err, data) => {
  if (err) throw err;
  return data;
});

const parser = (data) => {
  const allLines = data.split(/\r\n|\n/);
  const headers = allLines.shift().split('\t');

  return allLines.map(line => line.split('\t')).map(row => {
    return row.reduce((accum, column, i) => {
      const cleanColumn = column.replace(/[''"]+/g, '');
      return Object.assign(accum, { [headers[i]]: cleanColumn });
    }, {});
  });
};

exports.seed = function(knex, Promise) {
  console.log(parser);
  // Deletes ALL existing entries
  // return knex('table_name').del()
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('table_name').insert([
    //     {id: 1, colName: 'rowValue1'},
    //     {id: 2, colName: 'rowValue2'},
    //     {id: 3, colName: 'rowValue3'}
    //   ]);
    // });
};
