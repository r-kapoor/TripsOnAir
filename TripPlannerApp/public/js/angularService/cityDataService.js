inputModule.service('cityData', function () {
        var data = [
            {
                "name": "Bangalore",
                "tier": "1"
            },
            {
                "name": "New Delhi",
                "tier": "1"
            },
            {
                "name": "Mumbai",
                "tier": "1"
            },
            {
                "name": "Hyderabad",
                "tier": "2"
            },
            {
                "name": "Goa",
                "tier": "2"
            }
            ];
        return {
            getProperty: function () {
                return data;
            }
        };
    });