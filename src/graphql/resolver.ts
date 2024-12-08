import axios from "axios"
import { TOKEN,URL } from "../../info";

export const QUERY={
    Query:{
        fbpages:async ()=>{
            const response=await FBpages();
            return response.data.data
        },
        pagedetail:async(_:any,args:{id:string})=>{
            const data=await GetPageDetails(args.id)
            return data
        }
    }
}

//give page id
async function FBpages(){
    const response=await axios.get(`${URL}/me/accounts?access_token=${TOKEN}`)
    return response
}

//page details
async function GetPageDetails(id: string) {
    try {
        // Get Instagram business account
        const pageResponse = await axios.get(`${URL}/${id}/?fields=instagram_business_account&access_token=${TOKEN}`);
        const instagram_business_account = pageResponse.data.instagram_business_account?.id;
        
        if (!instagram_business_account) {
            return {
                followers_count: 0,
                follows_count: 0,
                username: null,
                media_count: 0,
                profile_picture_url: null,
                biography: null,
                id: id,
                name: null,
                media: [],
                stories: []
            };
        }

        // Get account details
        const response = await axios.get(`${URL}/${instagram_business_account}`, {
            params: {
                access_token: TOKEN,
                fields: 'followers_count,stories,follows_count,username,media_count,name,media,profile_picture_url,biography'
            }
        });

        const mediaUrls = response.data.media?.data || [];
        const storiesUrls = response.data.stories?.data || [];

        // Fetch media and stories in parallel
        const [media, stories] = await Promise.all([
            Promise.all(
                mediaUrls.map(async (mediaId: { id: string }) => {
                    return await GetMedia(mediaId.id);
                })
            ),
            Promise.all(
                storiesUrls.map(async (val: { id: string }) => {
                    return await GetStories(val.id);
                })
            )
        ]);

        return {
            followers_count: response.data.followers_count || 0,
            follows_count: response.data.follows_count || 0,
            username: response.data.username,
            media_count: response.data.media_count || 0,
            profile_picture_url: response.data.profile_picture_url,
            biography: response.data.biography,
            id: response.data.id,
            name: response.data.name,
            media,
            stories
        };

    } catch (err) {
        console.error("Error in GetPageDetails:", err);
        return {
            followers_count: 0,
            follows_count: 0,
            username: null,
            media_count: 0,
            profile_picture_url: null,
            biography: null,
            id: id,
            name: null,
            media: [],
            stories: []
        };
    }
}


//data of media
async function GetMedia(id: string) {
    try {
        const response = await axios.get(
            `${URL}/${id}`, {
                params: {
                    access_token: TOKEN,
                    fields: 'id,media_url,like_count,comments_count,caption,media_type'
                }
            }
        );
        
        const insights = await GetMediaInsights(id);
        
        return {
            id: response.data.id,
            media_url: response.data.media_url || null,
            likes_count: response.data.like_count || 0,
            comments_count: response.data.comments_count || 0,
            caption: response.data.caption || null,
            media_type: response.data.media_type || null,
            ...insights
        };
    } catch (error) {
        console.error(`Error fetching media ${id}:`);
        return {
            id: id,
            media_url: null,
            likes_count: 0,
            comments_count: 0,
            caption: null,
            shares_count: 0,
            saved_count: 0,
            reach_count: 0,
            media_type: null
        };
    }
}

//insights of media
async function GetMediaInsights(mediaId: string) {
    try {
        const response = await axios.get(
            `${URL}/${mediaId}/insights`, {
                params: {
                    metric: 'shares,saved,reach',
                    access_token: TOKEN
                }
            }
        );

        if (!response.data?.data) {
            console.warn(`No insights data available for media ${mediaId}`);
            return {
                shares_count: 0,
                saved_count: 0,
                reach_count: 0
            };
        }
        console.log(response.data.data);

        const insights = await response.data.data.reduce((acc: any, metric: any) => {
            const value = metric.values[0]?.value || 0;
            console.log(value);
            
            switch(metric.name) {
                case 'shares':
                    acc.shares_count = value;
                    break;
                case 'saved':
                    acc.saved_count = value;      
                    break;
                case 'reach':
                    acc.reach_count = value;
                    break;
            }
            return acc;
        }, {
            shares_count: 0,
            saved_count: 0,
            reach_count: 0
        });
        
        
        
        return insights;
    } catch (error) {
        console.error(`Error fetching insights for media ${mediaId}:`);
        return {
            shares_count: 0,
            saved_count: 0,
            reach_count: 0
        };
    }
}

//stories
async function GetStories(id:string){
    try{
        const response = await axios.get(
            `${URL}/${id}`, {
                params: {
                    access_token: TOKEN,
                    fields: 'id,media_url,like_count,comments_count'
                }
            }
        );

        if (!response.data) {
            console.warn(`No story data found for ID ${id}`);
            throw new Error('No story data available');
        }

        const insights = await GetStoriesInsights(id);

        return {
            id: response.data.id,
            media_url: response.data.media_url || null,
            like_count: response.data.like_count || 0,
            comments_count: response.data.comments_count || 0,
            ...insights
        };
    } catch (err) {
        console.error(`Error fetching story ${id}:`);
        return {
            id: id,
            media_url: null,
            like_count: 0,
            comments_count: 0,
            shares_count: 0,
            impressions_count: 0,
            reach_count: 0
        }

    }
}

//insights of stories
async function GetStoriesInsights(id:string){
    try{
        const response=await axios.get(
            `${URL}/${id}/insights`,{
                params:{
                    access_token:TOKEN,
                    metric:`shares,reach,impressions`
                    
                }
            }
        )
        const data=await response.data

        const insights = response.data.data.reduce((acc: any, metric: any) => {
            const value = metric.values[0]?.value || 0;
            switch(metric.name) {
                case 'shares':
                    acc.shares_count = value;
                    break;
                case 'reach':
                    acc.reach_count = value;
                    break;
                case 'impressions':
                    acc.impressions_count = value;
                    break;
                default:
                    console.warn(`Unknown metric type: ${metric.name}`);
            }
            return acc;
        }, {
            shares_count: 0,
            reach_count: 0,
            impressions_count: 0
        });

        return insights;
        
    } catch (err) {
        console.error(`Error fetching story insights ${id}:`);
        return {
            shares_count: 0,
            reach_count: 0,
            impressions_count: 0
        };
    }
}