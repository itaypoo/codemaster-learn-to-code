import styles from './Signup.module.css'
import {useEffect, useState} from "react";
import TopBar from "@/components/TopBar";
import {auth, database} from "@/scripts/firebaseconfig";
import {createUserWithEmailAndPassword, updateProfile} from "@firebase/auth";
import {useRouter} from "next/router";
import {addDoc, collection, doc, setDoc} from "@firebase/firestore";
export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        //prevent the browser from showing default error bubble / hint
        document.addEventListener('invalid', (function(){
            return function(e) {
                e.preventDefault();
                setError("אנא הכנס כתובת אימייל תקינה.")
            };
        })(), true);
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if(email === '' || password === '' || repeatPassword === '' || name === '') {
            setError('אנא מלא את כל השדות.')
            return
        }
        else if(password !== repeatPassword) {
            setError('הסיסמאות לא תואמות.')
            return
        }
        else if(password.length < 6) {
            setError('הסיסמא צריכה להיות באורך של 6 תווים לפחות.')
            return
        }
        else {
            setError('')
            setLoading(true)

            await createUser()
            router.push("/courses")
        }
    }

    const createUser = async () => {
        //sign up via firebase
        const userCred = await createUserWithEmailAndPassword(auth, email, password).catch((error) => {
            // error creating user
            setLoading(false)
            handleError(error.code, error.message)
        })

        // user created successfully
        // rename the user
        await updateProfile(auth.currentUser!!, {
            displayName: name
        })

        // create a user doc in firestore
        const uid = "" + auth.currentUser?.uid
        await setDoc(doc(database, "users", uid), {
            name: name,
            email: email,
            courses_bought: [],
        })
    }

    const handleError = (code: string, msg: string) => {
        switch (code) {
            case 'auth/email-already-in-use':
                setError('כבר קיים משתמש עם כתובת האימייל הזו. התכוונת להתחבר? ')
                break;
            default:
                let newmsg = msg.replaceAll("Firebase", "Fx")
                newmsg = newmsg.replaceAll("firebase", "fx")
                setError('שגיאה לא ידועה -' + newmsg)
                break;
        }
    }

    return (
        <>
            <TopBar/>

            <div className={styles.mainContainer}>
                <div className={`card ${styles.mainCard}`}>
                    <h1 className={`card-title ${styles.formTitle}`}>המסע שלך מתחיל כאן</h1>
                    <form className={styles.mainForm} onSubmit={handleSubmit}>

                        <div className={`input-label`}>
                            <input
                                type={"text"}
                                placeholder={"a"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label>שם משתמש</label>
                        </div>

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

                        <div className={`input-label`}>
                            <input
                                type={"password"}
                                placeholder={"a"}
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                            <label>סיסמא שנית</label>
                        </div>

                        <p style={{color: 'red'}}>{error}</p>

                        <div className={`button-group`}>
                            <button type={'submit'} disabled={loading}>הרשמה</button>
                            <button type={'button'} className={`outlined`}
                                    onClick={() => router.push('/login')}
                            >
                                כבר יש לי משתמש
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}