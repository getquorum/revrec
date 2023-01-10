'use strict';

const fs = require('fs');
const moment = require('moment');
const csv = require('csvtojson');
const jsonexport = require('jsonexport');

async function run() {

    try {

        let results = [];

        const jsonArray = await csv().fromFile('./data.csv');

        // Process Subscriptions Only
        const subs = jsonArray
            .filter(row => row.type === 'subscription')
            .map(row => {
                row.term = 12;        
                row.start_year = moment(row.activation_date).format('YYYY');
                row.start_month = moment(row.activation_date).format('MM');
                row.end_date = moment(row.activation_date).add(364, 'days').format('YYYY-MM-DD');
                row.end_year = moment(row.end_date).format('YYYY');
                row.end_month = moment(row.end_date).format('MM');
                row.mrr = parseFloat(row.subtotal) / 12;
                return row;
            });

        subs.forEach(sub => {
            // Break down the recognition into months
            for (let i = 0; i < sub.term; i++) {
                const mrr_ym = moment(sub.activation_date).add(i, 'months');
                results.push({
                    ...sub,
                    mrr_ym: mrr_ym.format('YYYY-MM'),
                    mrr_y: mrr_ym.format('YYYY'),
                    mrr_m: mrr_ym.format('MM'),
                    i: i+1
                });
            }
        });
        
        // Process One-time charges

        const otc = jsonArray
            .filter(row => row.type === 'charge')
            .map(row => {
                row.term = 1;        
                row.start_year = moment(row.activation_date).format('YYYY');
                row.start_month = moment(row.activation_date).format('MM');
                row.end_date = moment(row.activation_date).add(364, 'days').format('YYYY-MM-DD');
                row.end_year = moment(row.end_date).format('YYYY');
                row.end_month = moment(row.end_date).format('MM');
                row.mrr = parseFloat(row.subtotal);
                return row;                

            });

        otc.forEach(otc => {
            // Break down the recognition into months
            for (let i = 0; i < otc.term; i++) {
                const mrr_ym = moment(otc.activation_date).add(i, 'months');
                results.push({
                    ...otc,
                    mrr_ym: mrr_ym.format('YYYY-MM'),
                    mrr_y: mrr_ym.format('YYYY'),
                    mrr_m: mrr_ym.format('MM'),
                    i: i+1
                })                
            };
        });

        jsonexport(results, (err, csv) => {
            if (err) {
                throw err;
            }
            fs.writeFileSync('output.csv', csv);
        });


    } catch (err) {
        throw err;
    }

}









run();