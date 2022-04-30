import React from 'react';
import moment from 'moment';
import { getGlobalTime } from "components/common/Worldtime";

moment().format();

class Countdown extends React.Component {
	state = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		title: undefined,
		circleColor: undefined,
		labelColor: undefined,
		fontColor: undefined,
	}

	async componentDidMount() {
		const start = await getGlobalTime();
		this.count = 0;

		this.interval = setInterval(async() => {
			const { timeTillDate, title, circleColor, fontColor, labelColor } = this.props;
			const then = moment(timeTillDate * 1000);
			const now = moment(start * 1000 + 1000 * this.count);
			if(now <= then) {
				const days = then.diff(now, 'days').toString();
				const hours = (then.diff(now, 'hours') % 24).toString();
				const minutes = (then.diff(now, 'minutes') % 60).toString();
				const seconds = (then.diff(now, 'seconds') % 60).toString();
				this.setState({ days, hours, minutes, seconds, title, circleColor, fontColor, labelColor });
				this.count++;
			} else {
				this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0, title: "Releasing duration is over", circleColor, fontColor, labelColor });
				clearInterval(this.interval);
			}
		}, 1000);
	}

	componentWillUnmount() {
		if(this.interval) {
			clearInterval(this.interval);
		}
	}
	
	render() {
		const { days, hours, minutes, seconds, title, circleColor, fontColor, labelColor} = this.state;
		const daysRadius = mapNumber(days % 40, 40, 0, 0, 360);
		const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
		const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
		const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);

		const labelStyle = {color: labelColor, fontSize: "0.65rem", fontWeight: "600", textTransform: "uppercase"};
		const fontStyle = {color: fontColor}
		const countdownWrapper = {display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}
		const h1Style = {fontSize: "1rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: '2px', textAlign: "center", marginBottom:"10px"};

		const countdownItem = {
			color: "#111",
			fontSize: "40px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			lineHeight: "30px",
			margin: "10px",
			paddingTop: "10px",
			position: "relative",
			width: "100px",
			height: "100px",
		}
	
		if(!seconds) {
			return null;
		}
		
		return (
			<div>
				<div style={h1Style}>{title}</div>
				<div style={countdownWrapper}>
					{days && (
						<div style={countdownItem}>
							<SVGCircle radius={daysRadius} circleColor={circleColor} />
							<span style={fontStyle}>{days}</span>
							<span style={labelStyle}>days</span>
						</div>
					)}
					{hours && (
						<div style={countdownItem}>
							<SVGCircle radius={hoursRadius} circleColor={circleColor} />
							<span style={fontStyle}>{hours}</span> 
							<span style={labelStyle}>hours</span>
						</div>
					)}
					{minutes && (
						<div style={countdownItem}>
							<SVGCircle radius={minutesRadius} circleColor={circleColor} />
							<span style={fontStyle}>{minutes}</span>
							<span style={labelStyle}>minutes</span>
						</div>
					)}
					{seconds && (
						<div style={countdownItem}>
							<SVGCircle radius={secondsRadius} circleColor={circleColor} />
							<span style={fontStyle}>{seconds}</span>
							<span style={labelStyle}>seconds</span>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const countdownSvg = {
	position: "absolute",
	top: "0",
	left: "0",
	width: "100px",
	height: "100px",
}
const SVGCircle = ({ radius, circleColor }) => (
	<svg style={countdownSvg}>
		<path fill="none" stroke={circleColor} strokeWidth="4" d={describeArc(50, 50, 48, 0, radius)}/>
	</svg>
);

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function mapNumber(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export default Countdown;