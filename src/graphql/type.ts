export const TYPE_DEFS = `
    type FbPage {
        name: String
        category: String
        id: String
        pagedetail:PageDetail
    }
    type PageDetail{
        followers_count:Int
        follows_count:Int
        username:String
        media_count:Int
        profile_picture_url:String
        biography:String
        id: String
        name:String
        media: [Media]
        stories: [Story]
    }
    type Media{
        id:String
        media_url:String
        likes_count:Int
        comments_count:Int
        caption:String
        shares_count: Int
        saved_count: Int
        reach_count: Int
        media_type: String
    }
    type Story{
        id:String
        media_url:String
        like_count:Int
        comments_count:Int
        shares_count: Int
        impressions_count: Int
        reach_count: Int
    }
 
    type Query {
        fbpages: [FbPage]
        pagedetail(id: String!): PageDetail
    }
`;