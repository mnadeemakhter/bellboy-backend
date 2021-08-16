class Localization {

    getLabels(data, code) {
        let newData = [];
        for (const v of data) {
            let labels = v.labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (labels.length != 0) v.title = labels[0].label;

            var item = {};
            item = this.getData(v,['locales','labels']);
            newData.push(item);


        }
        return newData;
    }

    getLabelsWithKey(data, code, obj) {
        let newData = [];
        for (const v of data) {

            let labels = v[obj].labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (labels.length != 0) v[obj].title = labels[0].label;

            var item = {};
            var keys = Object.keys(v[obj].toObject());
            keys = keys.filter(item => item !== 'locales');
            keys = keys.filter(item => item !== 'labels');
            let d = {};
            keys.forEach(key => {

                d[key] = v[obj][key];

            });
            item[obj] = d;
            item.active = v.active;
            item._id = v._id;
            newData.push(item);


        }
        return newData;
    }

    getLabelsWithNestedKey(data, code, obj) {
        let newData = [];
        for (const v of data) {

            let labels = v[obj].labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (labels.length != 0) v[obj].title = labels[0].label;

            var item = Object.assign({},v);
            var keys = Object.keys(v[obj].toObject());
            keys = keys.filter(item => item !== 'locales');
            keys = keys.filter(item => item !== 'labels');
            let d = {};
            keys.forEach(key => {

                d[key] = v[obj][key];

            });
            item[obj] = d;
            item.active = v.active;
            item._id = v._id;
            newData.push(item);


        }
        return newData;
    }
    getLabelsForCart(data, code) {
        let newData = [];
        for (const v of data) {

            let productLabels = v['product'].labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (productLabels.length != 0) v['product'].title = productLabels[0].label;

            let brandLabels = v['brand'].labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (brandLabels.length != 0) v['brand'].title = brandLabels[0].label;

            var item = {};
         

    
            item = this.getData(v,['product','brand']);

            item['brand'] = this.getData(v['brand'],['locales','labels']);
         
            item['product'] = this.getData(v['product'],['locales','labels',]);
    
            newData.push(item);


        }
        return newData;
    }

    getLabelForHiringCart(data, code) {
        let newData = [];
        for (const v of data) {

            let actionTypeLabels = v['actionType'].labels.filter(function (label) {
                return label.locale.code == code;
            });
            if (actionTypeLabels.length != 0) v['actionType'].title = actionTypeLabels[0].label;

            // let brandLabels = v['brand'].labels.filter(function (label) {
            //     return label.locale.code == code;
            // });
            // if (brandLabels.length != 0) v['brand'].title = brandLabels[0].label;

            var item = {};
         

    
            item = this.getData(v,['actionType']);

         
            item['actionType'] = this.getData(v['actionType'],['locales','labels',]);
    
            newData.push(item);


        }
        return newData;
    }

    getData(item,filters = []){

        var keys = Object.keys(item.toObject());
        var data = {};
        
       // console.log('Before',keys);
        if(filters.length!=0){
            filters.forEach(filter=>{
                keys = keys.filter(f => f !== filter);
            })
        }

        keys.forEach(key => {
            data[key] = item[key];
        });
       // console.log('After',keys);
        return data;
    }
}

module.exports = new Localization(); 