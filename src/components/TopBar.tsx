import styles from './TopBar.module.css'
import {useRouter} from "next/router";
import {auth} from "@/scripts/firebaseconfig";
import {useEffect, useState} from "react";
import {User} from "@firebase/auth";

export default function TopBar() {
    const router = useRouter()
    const [user, setUser] = useState<User|null>()

    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            console.log(user)
            setUser(user)
        })
    }, [])

    const logOut = () => {
        auth.signOut().then(() => {
            setUser(null)
            router.push("/login")
        })
    }

    let userButton;
    if(user) {
        userButton = (
            <div className={'dropdown'}>
                <button className={`has-dropdown ${styles.userButton}`}>
                    {"שלום, " + user.displayName}
                </button>
                <div className={'dropdown-content'}>
                    <a onClick={()=> {router.push("/courses")}}>
                        הקורסים שלי
                    </a>
                    <a onClick={logOut}>
                        התנתקות
                    </a>
                </div>
            </div>
        )
    }
    else {
        userButton = (
            <div className={styles.authButtons}>
                <button className={`outlined ${styles.login}`}
                        onClick={()=>{router.push("/login")}}
                >
                    התחברות
                </button>
                <button className={`outlined ${styles.signup}`}
                        onClick={()=>{router.push("/signup")}}
                >
                    הרשמה
                </button>
            </div>
        )
    }

    return (
        <div className={styles.topbar}>
            <h1 className={styles.title}
                onClick={()=>{router.push("/")}}
            >
                {' </> קודמאסטר '}
            </h1>

            <div className={styles.flexPad}></div>

            {userButton}
        </div>
    )
}