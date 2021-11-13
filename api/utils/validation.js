/*
* Request payload validation
*/

const moment = require('moment');


module.exports = {

    recordPayloadValidation: function(data){
        let validationErr = [];
        if(data.startDate == undefined || data.startDate == null || data.startDate == '' || data.endDate == undefined || data.endDate == null || data.endDate == ''){
            validationErr.push({'error': `Bad request startDate & endDate are mandatory`});
        }
        if(data.startDate && data.endDate){
            let startDate = moment(data.startDate, 'YYYY-MM-DD',true).isValid();
            let endDate = moment(data.endDate, 'YYYY-MM-DD',true).isValid();
            if(!startDate || !endDate){
                validationErr.push({'error': `Bad request startDate & endDate should be in 'YYYY-MM-DD' formate`});
            }
        }
        return validationErr;
    }
};