import styles from './InfoCard.module.css'
import {type} from "os";

type InfoCardProps = {
    title: string,
    description: string,
    icon: string
}
export default function InfoCard(props: InfoCardProps) {

    return(
        <div className={`card ${styles.infoCard}`}>
            <div className={styles.textContainer}>
                <h1 className={'card-title'}>{props.title}</h1>
                <p>{props.description}</p>
            </div>
            <div className={styles.iconContainer}>
                <span className={`material-symbols-rounded`}>{props.icon}</span>
            </div>
        </div>
    )
}