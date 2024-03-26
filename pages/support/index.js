import MessageCard from "@/components/MessageCard/MessageCard";
import axios from "axios";

export default function Support({suggestions}) {
    return (
        <div>
            {suggestions.map((sug) => {
                return (
                    <MessageCard
                        key={`message-${sug?._id}`}
                        subject={sug?.subject}
                        message={sug?.message}
                        email={sug?.email}
                        date={new Date(sug?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        Name={sug?.fullName}
                    />
                )
            })}
        </div>
    )
}

// SERVER SIDE PROPS
export async function getServerSideProps(ctx) {
    // GET THE TOKEN FROM THE COOKIES
    const token = ctx.req.cookies.token;

    // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // FETCH THE MESSAGES FROM THE API
    const suggestions = await axios.get(`https://api.lathaty.com/api/v1/suggestions`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((res) => {
            return res.data?.suggestions || [];
        })
        .catch(err => {
            console.log(err)
        })

    const propsObj = {};
    if(suggestions){
        propsObj['suggestions'] = suggestions
    }

    return {
        props: propsObj,
    };
}