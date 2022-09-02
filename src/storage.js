const storage = () => {
    let dataStorage = {

        "today" :{   
            /**
             * add
             * @params string : name of the city, json : weather data
             * @returns nothing
             */
            "add": (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"today": data};
            },
            
            /**
             * update
             * @param {string, json} : name of the city, weather data
             * @returns nothing
             */
            "update" : (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"today": data};
            },
            
            /**
             * destroy
             * @param {string} : name of the city
             * @returns nothing
             */
            "destroy" : (city) => {
                city = city.toLowerCase();
                delete dataStorage.citys[city].today;
            },

            "get" : (city) => {
                // console.log("get " + city + " today")
                city = city.toLowerCase();

                if(isEmpty(dataStorage.citys[city])){
                    return undefined;
                }

                return dataStorage.citys[city].today;
            }
        },

        "yesterday" :{   
            /**
             * add
             * @params string : name of the city, json : weather data
             * @returns nothing
             */
            "add": (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"yesterday": data};
            },
            
            /**
             * update
             * @params string : name of the city, json : weather data
             * @returns nothing
             */
            "update" : (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"yesterday": data};
            },
            
            /**
             * destroy
             * @params string : name of the city
            * @returns nothing
             */
            "destroy" : (city) => {
                city = city.toLowerCase();
                delete dataStorage.citys[city].yesterday;
            },

            "get" : (city) => {
                city = city.toLowerCase();
                // console.log("get " + city + " yesterday")
                if(isEmpty(dataStorage.citys[city])){
                    return undefined;
                }
                return dataStorage.citys[city].yesterday;
            }
        },

        "daybefore" :{   
            /**
             * add
             * @params string : name of the city, json : weather data
             * @returns nothing
             */
            "add": (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"daybefore": data};
            },
            
            /**
             * update
             * @params string : name of the city, json : weather data
             * @returns nothing
             */
            "update" : (city, data) => {
                city = city.toLowerCase();
                dataStorage.citys[city] = {...dataStorage.citys[city],"daybefore": data};
            },
            
            /**
             * destroy
             * @params string : name of the city
            * @returns nothing
             */
            "destroy" : (city) => {
                city = city.toLowerCase();
                delete dataStorage.citys[city].daybefore;
            },

            "get" : (city) => {
                city = city.toLowerCase();
                // console.log("get " + city + " day before")
                if(isEmpty(dataStorage.citys[city])){
                    return undefined;
                }
                return dataStorage.citys[city].daybefore;
            }
            
        },

        "rollForwards" : () => {
            for(const [key, value] of Object.entries(dataStorage.citys)) {

                if(dataStorage.citys[key].yesterday !== undefined)
                {
                    dataStorage.citys[key].daybefore = dataStorage.citys[key].yesterday;
                }
                
                if( dataStorage.citys[key].today !== undefined){
                    dataStorage.citys[key].yesterday = dataStorage.citys[key].today;
                }

                delete dataStorage.citys[key].today;
            }
        },

        "getCities" : () => {
            return Object.keys(dataStorage.citys);
        }

        
    };


    dataStorage.citys = {};
    return dataStorage;
    
    
}

export {storage}



/// helpers
const isEmpty = (obj) => {

    if(typeof(obj) === 'object'){
        return Object.keys(obj).length === 0;
    }

    return true;
}