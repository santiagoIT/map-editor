
var graph = [
    {
        mapId:1,
        links:[
            {
                map:{
                    mapId:2,
                    links:[
                        {
                            map : {
                                mapId: 4,
                                links : [
                                    {
                                        map : {
                                            mapId : 5
                                        },
                                        tunnel : '4_5'
                                    },
                                    {
                                        map :{
                                            mapId : 6
                                        },
                                        tunnelId: '4_6'
                                    }
                                ]

                            },
                            tunnel : '4_2'
                        }
                    ]
                },
                tunnelId:'1_2'
            },
            {
                map:{
                    mapId:3
                },
                tunnelId:'1_3'
            }
        ]
    }
];