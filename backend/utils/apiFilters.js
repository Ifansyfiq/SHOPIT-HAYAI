class APIFilters {
    constructor(query, queryStr) {
        this.query = query; // query is the model
        this.queryStr = queryStr; // queryStr is the query string
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // search for keyword in name
                $options: "i" // case insensitive
            }
        }
            : {} // if no keyword, return empty object

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filters() {
        const queryCopy = { ...this.queryStr };

        //fields to exclude
        const fieldsToRemove = ['keyword']
        fieldsToRemove.forEach((el) => delete queryCopy[el]);


        // Advance filter for price, ratings etc
        
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);  // add $ sign before gt, gte, lt, lte

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
}

export default APIFilters;