import TopBar from "@/components/TopBar";
import styles from "./Courses.module.css";
import CourseCard from "./CourseCard";
import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query} from "@firebase/firestore";
import {auth, database} from "@/scripts/firebaseconfig";
import {number} from "prop-types";
import {onAuthStateChanged} from "@firebase/auth";


export default function CoursesPage() {
    const [allCourseList, setAllCourseList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [boughtCoursesList, setBoughtCoursesList] = useState([])
    const [notBoughtCoursesList, setNotBoughtCoursesList] = useState([])

    const getCourses = async () => {
        console.log("reading course list")
        const courseQuery = query(collection(database, "COURSES"))
        const snapshot = await getDocs(courseQuery)
        let allCourses = []
        snapshot.forEach((doc) => {
            const newCourse = {
                name: doc.id,
                title: doc.get("title"),
                price: doc.get("price"),
                description: doc.get("description"),
            }
            allCourses.push(newCourse)
        })

        setAllCourseList(allCourses)
        setIsLoading(false)
        // filter bought courses into a separate list
    }
    // get all courses once mounted
    useEffect(()=> {
        getCourses()
    }, [])

    const filterBoughtCourses = async () => {
        if (auth.currentUser != null) {
            const userRef = doc(database, `users/${auth.currentUser.uid}`)
            const userDoc = await getDoc(userRef)
            const coursesBoughtNames = userDoc.get("courses_bought")

            let boughtCourses = []
            let notBoughtCourses = allCourseList

            notBoughtCourses.forEach((course) => {
                if (coursesBoughtNames.includes(course.name)) {
                    boughtCourses.push(course)
                    notBoughtCourses = notBoughtCourses.filter((c) => c.name !== course.name)
                }
            })

            setBoughtCoursesList(boughtCourses)
            setNotBoughtCoursesList(notBoughtCourses)

        }
    }
    useEffect(()=> {
        filterBoughtCourses()
    }, [allCourseList])

    const coursesSkeleton = () => {
        const amount = 2
        return (
            <div className={`${styles.cards}`}>
                {
                    [...Array(amount)].map((e, i) => {
                        return (
                            <div key={i} className={`card clickable ${styles.skeletonCard}`}>
                                <div className={`skeleton ${styles.skeletonImage}`}/>
                                <div className={styles.skeletonTitleContainer}>
                                    <span className={`skeleton ${styles.skeletonTitle}`} >Skeleton Card</span>
                                </div>
                                <br/>
                                <span className={`skeleton ${styles.skeletonDesc}`}>lorem ipsum dut piu lit it suomet dit ronerf</span>
                                <span className={`skeleton ${styles.skeletonDesc}`}>lorem ipsum dut piu lit it suomet dit ronerf</span>
                                <span className={`skeleton ${styles.skeletonDesc}`}>lorem ipsum dut piu lit it suomet dit ronerf</span>
                                <span className={`skeleton ${styles.skeletonDesc}`}>lorem ipsum dut piu lit it suomet dit ronerf</span>
                                <span className={`skeleton ${styles.skeletonDesc}`}>lorem ipsum dut piu lit it suomet dit ronerf</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const coursesList = () => {
        if(auth.currentUser != null) {
            // filtered courses
            return (
                <div>
                    <p className={styles.subtitle}>קורסים בבעלותך</p>
                    <div className={styles.cards}>
                        {
                            boughtCoursesList.map(
                                (course, i) => {
                                    return (
                                        <CourseCard
                                            key={i}
                                            title={course.title}
                                            description={course.description}
                                            image={"/android-studio-banner.png"}
                                            price={course.price}
                                            owned={true}
                                        />
                                    )
                                })
                        }
                    </div>

                    <p className={styles.subtitle}>קורסים נוספים</p>
                    <div className={styles.cards}>
                        {
                            notBoughtCoursesList.map(
                                (course, i) => {
                                    return (
                                        <CourseCard
                                            key={i}
                                            title={course.title}
                                            description={course.description}
                                            image={"/android-studio-banner.png"}
                                            price={course.price}
                                            owned={false}/>
                                    )
                                })
                        }
                    </div>
                </div>
            )
        }
        else {
            // all courses
            return (
                <div className={styles.cards}>
                    {
                        allCourseList.map(
                            (course, i) => {
                                return (<CourseCard key={i} title={course.title} description={course.description} image={"/android-studio-banner.png"} price={course.price} owned={false}/>)
                            })
                    }
                </div>
            )
        }
    }

    return (
        <>
            <TopBar/>
            <div className={styles.main}>
                <h1>כל הקורסים</h1>
                { isLoading && coursesSkeleton() }
                { coursesList() }
            </div>
        </>
    )
}