import styles from "./CourseCard.module.css"

type CourseCardProps = {
    title: string,
    description: string[],
    image: string,
    price: number,
    owned: boolean
}

export default function CourseCard(props: CourseCardProps) {

    return (
        <div className={`card clickable ${styles.courseCard}`}>
            <img src={props.image}/>
            <h1 className={'card-title'}>{props.title}</h1> <br/>
            {props.description.map((desc, index) => {
                return ( <> <span style={{marginBottom: "7px"}} key={index}>{desc}</span> <br/> </> )
            })}
            <br/>
            {
                props.owned
                    ? <button className={"card-action-button"}>אל השיעורים</button>
                    : <button className={"card-action-button"}>לרכישה ({props.price + "₪"})</button>
            }
        </div>
    )
}