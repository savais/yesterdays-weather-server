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

                if(dataStorage.yesterday.get(city) === undefined)
                {
                    dataStorage.citys[city].yesterday = {}
                }

                if(dataStorage.daybefore.get(city) === undefined)
                {
                    dataStorage.citys[city].daybefore = {}
                }

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
                if(dataStorage.citys[city] == undefined){
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

                if(dataStorage.today.get(city) === undefined)
                {
                    dataStorage.citys[city].today = {}
                }

                if(dataStorage.daybefore.get(city) === undefined)
                {
                    dataStorage.citys[city].daybefore = {}
                }

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
                if(dataStorage.citys[city] == undefined){
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

                if(dataStorage.today.get(city) === undefined)
                {
                    dataStorage.citys[city].today = {}
                }

                if(dataStorage.yesterday.get(city) === undefined)
                {
                    dataStorage.citys[city].yesterday = {}
                }
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
                if(dataStorage.citys[city] == undefined){
                    return undefined;
                }
                return dataStorage.citys[city].daybefore;
            }
            
        },

        "rollForwards" : () => {
            for(const [key, value] of Object.entries(dataStorage.citys)) {
                dataStorage.citys[key].daybefore = dataStorage.citys[key].yesterday;
                dataStorage.citys[key].yesterday = dataStorage.citys[key].today;
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