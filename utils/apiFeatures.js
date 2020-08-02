class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const filterQueryObj = { ...this.reqQuery };

    console.log(filterQueryObj);

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete filterQueryObj[el]); // remove fields for another features below

    const filterQueryStr = JSON.stringify(filterQueryObj);
    const mongoFilterQueryStr = filterQueryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); // add $ to match the mongo query
    const mongoFilterQueryObj = JSON.parse(mongoFilterQueryStr);

    this.query = this.query.find(mongoFilterQueryObj);

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // sort is the Mongoose method
    } else {
      this.query = this.query.sort('-ratingsAverage');
    }

    return this;
  }

  selectFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.reqQuery.page, 10) || 1;
    const limit = parseInt(this.reqQuery.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
