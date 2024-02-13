import PropTypes from "prop-types"
import {useEffect} from "react"
import {Button} from "@mui/material"

const ReviewedButtonRenderer = (props) => {

    useEffect(() => {
        console.log('[ReviewedButton]', props)
    }, []);

    return (
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            {props.value === "reported" && (
                <Button
                    style={{height: "18px"}}
                    variant="contained"
                    size="small"
                    onClick={() => props.clicked && props.clicked(props.data.incident_id)}>確認</Button>
            )}
            {props.value === "reviewed" && (<div>済</div>)}
        </div>
    )
}

ReviewedButtonRenderer.propTypes = {
    clicked: PropTypes.func,
    value: PropTypes.string,
}

export default ReviewedButtonRenderer
