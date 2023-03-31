import {useState} from "react";
import {useRouter} from "next/router";
import styles from "./Home.module.css";
import InfoCard from "./InfoCard";

export default function HomePage() {
    const [contactMail, setContactMail] = useState("")
    const [contactTitle, setContactTitle] = useState("")
    const [contactBody, setContactBody] = useState("")
    const router = useRouter()

    const description =
        "ללמוד תכנות בלי להיות גאון. להנות מהתהליך. לראות תוצאות."

    const card1props = {
        title: "מי אני",
        description: "נעים להכיר, אני איתי." +
            " מגיל צעיר התחברתי לתכנות, אך המסע שלי באמת התחיל כאשר" +
            " הבנתי את הסוד שאף אחד לא רוצה לספר לכם - זה לא קשה ללמוד תכנות!!" +
            " בניתי משחקי מחשב, אלגוריתמים, אפליקציות, ואתרים (כולל האחד הזה :)",
        icon: "emoji_people",
    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <h1>קוד מאסטר</h1>
                <p>{description}</p>
                <br/>
                <button className={'big'}
                        onClick={() => {
                            router.push('/courses')
                        }}
                >
                    אל הקורסים
                </button>
                <img src={'/codeimg.png'} alt={"code"}/>
            </div>

            <div className={styles.infoContainer}>
                <InfoCard icon={card1props.icon} title={card1props.title} description={card1props.description}/>
                <InfoCard icon={"code"} title={card1props.title} description={card1props.description}/>
                <InfoCard icon={"question_mark"} title={card1props.title} description={card1props.description}/>
            </div>

            <form className={styles.contactContainer} action={"https://mailthis.to/mailitay"} method={'POST'}>
                <div className={`card ${styles.contact}`}>
                    <h1 className={'card-title'}>דברו איתי</h1>

                    <div className={"input-label"}>
                        <input placeholder={"a"} type={"email"} name={"_replyto"} required
                               value={contactMail} onChange={(e) => setContactMail(e.target.value)}
                        />
                        <label>כתובת אימייל</label>
                    </div>

                    <div className={"input-label"}>
                        <input placeholder={"a"} type={"text"} name={"name"} required
                               value={contactTitle} onChange={(e) => setContactTitle(e.target.value)}
                        />
                        <label>סיבת פנייה</label>
                    </div>

                    <div className={"input-label"}>
                        <textarea placeholder={"a"} name={"message"} required
                                  value={contactBody} onChange={(e) => setContactBody(e.target.value)}
                        />
                        <label>תוכן פנייה</label>
                    </div>

                    <div className={'button-group'}>
                        <button type={'submit'}>שליחה</button>
                        <button className={'outlined'} type={"button"}
                                onClick={()=>{
                                    window.open(`mailto:itayanima@gmail.com ?subject=${contactTitle}&body=${contactBody}`)
                                }}
                        >
                            פנייה ישירה במייל
                        </button>
                    </div>

                </div>

                <img src={'https://i.giphy.com/media/aNqEFrYVnsS52/giphy.gif'} alt={"cat programmer"}/>
            </form>
        </div>
    )
}