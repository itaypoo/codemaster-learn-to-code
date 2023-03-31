import TopBar from "@/components/TopBar";
import styles from "@/ui/auth/Login.module.css";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "@/scripts/firebaseconfig";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        //prevent the browser from showing default error bubble / hint
        document.addEventListener('invalid', (function(){
            return function(e) {
                e.preventDefault();
                setError("אנא הכנס כתובת אימייל תקינה.")
            };
        })(), true);
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault()
        setLoading(true)

        if(email === '' || password === ''){
            setError("אנא מלא את כל השדות.")
            setLoading(false)
            return
        }
        else {
            setError('')
            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                // signed in
                router.push('/courses')
            }).catch((error) => {
                setLoading(false)
                handleError(error.code, error.message)
            })
        }
    }

    const handleError = (code: string, msg: string) => {
        switch (code) {
            case "auth/user-not-found":
                setError("לא קיים משתמש עם האימייל הזה. התכוונת להירשם?")
                break;
            case "auth/wrong-password":
                setError("סיסמא שגויה.")
                break;
            case "auth/user-disabled":
                setError("המשתמש הזה בוטל זמנית. אנא דבר איתנו להחזירו.")
                break;
            default:
                setError("שגיאה לא ידועה - " + msg)
        }
    }

    return(
        <>
            <TopBar/>

            <div className={styles.mainContainer}>
                <div className={`card ${styles.mainCard}`}>
                    <h1 className={`card-title ${styles.formTitle}`}>כיף לראות אותך שוב</h1>
                    <form className={styles.mainForm} onSubmit={handleSubmit}>

                        <div className={`input-label`}>
                            <input
                                type={"email"}
                                placeholder={"a"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>אימייל</label>
                        </div>

                        <div className={`input-label`}>
                            <input
                                type={"password"}
                                placeholder={"a"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>סיסמא</label>
                        </div>

                        <p style={{color: 'red'}}>{error}</p>

                        <div className={`button-group`}>
                            <button type={'submit'} disabled={loading}
                            >
                                הרשמה
                            </button>
                            <button type={'button'} className={`outlined`}
                                    onClick={() => router.push('/signup')}
                            >
                                אין לי משתמש
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}