const { json } = require("express");

class Apifeatures {
    constructor(query , queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    // search features api

    search(){
        const  keyword =  this.queryStr.keyword  ?  {
            name :{
                // mogdodb operator regex
                // ABC small or captital dono dhund k dega
                $regex:  this.queryStr.keyword, 
                $options: "i"// case insensitive 
            }
        } : {};
        
        this.query = this.query.find({...keyword});
        return this;  // yhi class return krega 
    }
    // catageory filter 
    
    filter() {
        // Clone the query object
        const querycopy = {...this.queryStr};
    
        // Remove fields not needed for filtering
        const removeFeilds = ["keyword", "page", "limit"];
        removeFeilds.forEach(key => delete querycopy[key]);
    
        // Filter for price and rating
        // Convert the query object to a string and replace operators with MongoDB syntax
        let queryStr = JSON.stringify(querycopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        // gt gretaer than 
        // gte greater than equal to 
        // lte less than equal to 
        // lt less than    
    
        // Apply the filter to the query
        this.query = this.query.find(JSON.parse(queryStr));
       
        return this;
    }


    pagination(resultPerPage){
   const currentPage =  Number(this.queryStr.page) || 1 ; 

     const skip = resultPerPage * (currentPage-1)

     this.query = this.query.limit(resultPerPage).skip(skip)

     return this ;
    }
    

   
    

}

module.exports  = Apifeatures