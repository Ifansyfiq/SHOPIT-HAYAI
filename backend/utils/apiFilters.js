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
}

export default APIFilters;