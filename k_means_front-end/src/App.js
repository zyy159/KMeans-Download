import React,{Component} from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import RedditIcon from "@material-ui/icons/Reddit";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./App.css";


axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://127.0.0.1:8000";


class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeStep : 0,
            n_clusters : 0,
            n_init : 10,
            max_iter : 300,
            tol : 0.0001,
            precompute_distances: "auto",
            algorithm: "auto",
            success: "",
            filename: "",
        }
        this.change = this.change.bind(this);
        this.run = this.run.bind(this);
        this.downlaod = this.downlaod.bind(this);
        this.next = this.next.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
    }

    change(key,e){
        this.setState({
            [key]: e.target.value
        });
        console.log("ChangeValue ",{...this.state})
    }

    next(){
        if (this.state.success == "【Upload Successfully】"){
            this.setState({ activeStep: this.state.activeStep + 1 })
        }else{
            this.setState({
            success: "【No File Uploaded】"
            })
        }
    }

    run(){
        if(this.state.tol != "" && this.state.n_clusters != "" && this.state.n_clusters != 0 && this.state.n_init != "" && this.state.max_iter !="" &&
        this.state.tol != 0 && this.state.n_init != 0 && this.state.max_iter != 0){
            this.setState({ activeStep: this.state.activeStep + 1 })
            let data = {...this.state};
            console.log("data", data);
            let res1 = axios.post(server+"/result/",data);
            console.log("post",res1);
            axios.get(server+"/result/");
        }else if(this.state.tol == "" || this.state.tol == 0){
            alert("请填写tol【容忍度】")
        }else if(this.state.n_clusters == "" || this.state.n_clusters == 0){
            alert("请填写n_clusters【簇的个数】")
        }else if(this.state.n_init == "" || this.state.n_init == 0){
            alert("请填写n_init【获取初始簇中心的更迭次数】")
        }else if(this.state.max_iter == "" || this.state.max_iter == 0){
            alert("请填写max_iter【最大迭代次数】")
        }
    }

    downlaod(){
        var fileDownload = require('react-file-download');
        axios.get(server+"/download/").then((response) => {
            fileDownload(response.data, 'Data_kmeans_modify.xls');
        });
        let res = axios.get("${server}/result/");
        console.log(res);
    }

    handleUpload(event) {
        const file = event.target.files[0]
        console.log(file)
        var fileName = file.name
        this.setState({
            filename: fileName
        })
        var data = new FormData()
        data.append("file", file)
        data.append("msg", "false")
        console.log("data",data.get("file"))
        axios.post(server+"/upload/", data, {headers: {"Content-Type": "multipart/form-data"}}).then((res)=>{
            if(res.status===200){
                this.setState({
                    success: "【Upload Successfully】"
                })
                console.log("Success",res);
            }else{
                this.setState({
                    success: "【Upload Fail】"
                })
            }
        })
    }


    renderInfo = () =>{
        if(this.state.activeStep===0){
            return (
                <div>
                    <Typography className="instructions">
                        <Card className="SubRoot" variant="outlined">
                            <CardContent className="Title">
                                <Typography variant="h4" gutterBottom >
                                    File Upload
                                </Typography>
                                <Typography className="State">
                                    {this.state.success} {this.state.filename}
                                </Typography>
                            </CardContent>
                            <CardActions className="UploadButton">
                                <input
                                    accept="*"
                                    id="contained-button-file"
                                    type="file"
                                    onChange={this.handleUpload}
                                    name = "file"
                                    className="Input"
                                />
                                <label htmlFor="contained-button-file">
                                    <Button component="span" > <CloudUploadIcon color="primary" style={{fontSize:150}}/> </Button>
                                </label>
                            </CardActions>
                        </Card>
                    </Typography>
                    <div className="Buttons">
                        <Button disabled onClick={() => this.setState({ activeStep: this.state.activeStep - 1 })} className="backButton" >
                            Back
                        </Button>
                        <Button className="ButtonRight" variant="contained" color="primary" onClick={this.next}>
                            Next
                        </Button>
                    </div>
                </div>
            );
        }else if(this.state.activeStep===1){
            return (
                <div>
                    <Typography className="instructions">
                        <Card className="SubRoot" variant="outlined">
                            <CardContent>
                                <form className="MuiTextField" noValidate autoComplete="off">
                                    <div className="Row">
                                        <TextField className="TextField" required label="n_clusters【簇的个数】" InputLabelProps={{shrink: true,}} onChange={(e)=>(this.change("n_clusters",e))} />
                                        <TextField className="Text_Field" required defaultValue="10" label="n_init【获取初始簇中心的更迭次数】" onChange={(e)=>(this.change("n_clusters",e))} />
                                    </div>
                                    <br />
                                    <div className="Row">
                                        <TextField className="TextField" required defaultValue="300" label="max_iter【最大迭代次数】" onChange={(e)=>(this.change("max_iter",e))} />
                                        <TextField className="Text_Field" required defaultValue="0.0001" label="tol【容忍度】" onChange={(e)=>(this.change("tol",e))} />
                                    </div>
                                    <br />
                                    <div className="Row">
                                        <FormControl className="TextField">
                                            <InputLabel id="precompute_distancesID">precompute_distances</InputLabel>
                                            <Select id="precompute_distancesID" labelId="precompute_distances【是否提前计算距离】" defaultValue="auto" onChange={(e)=>(this.change("precompute_distances",e))}>
                                                <MenuItem value={"auto"}>auto</MenuItem>
                                                <MenuItem value={"True"}>True</MenuItem>
                                                <MenuItem value={"False"}>False</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className="Text_Field">
                                            <InputLabel id="algorithm">algorithm</InputLabel>
                                            <Select labelId="algorithm【优化算法】" defaultValue="auto" id="algorithm" onChange={(e)=>(this.change("algorithm",e))}>
                                                <MenuItem value={"auto"}>auto</MenuItem>
                                                <MenuItem value={"full"}>full</MenuItem>
                                                <MenuItem value={"elkan"}>elkan</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </Typography>
                    <div className="Buttons">
                        <Button onClick={() => this.setState({ activeStep: this.state.activeStep - 1 })} className="backButton" >
                            Back
                        </Button>
                        <Button onClick={this.run} className="ButtonRight" variant="contained" color="primary" >
                            Run
                        </Button>
                    </div>
                </div>
            );
        }else if(this.state.activeStep===2){
            return (
                <div>
                    <Typography className="instructions">
                        <Card className="SubRoot" variant="outlined">
                            <CardContent className="Title">
                                <Typography variant="h4" gutterBottom >
                                    Result Download
                                </Typography>
                            </CardContent>
                            <CardActions className="UploadButton">
                                <Button component="span" onClick={this.downlaod}> <CloudDownloadIcon color="primary" style={{fontSize:150}}/> </Button>
                            </CardActions>
                        </Card>
                    </Typography>
                    <div className="Buttons">
                        <Button onClick={() => this.setState({ activeStep: this.state.activeStep - 1 })} className="backButton" >
                            Back
                        </Button>
                    </div>
                </div>
            );
        }else if(this.state.activeStep===3){
            return(
                <div>
                    <Typography className="instructions">All steps completed</Typography>
                    <Button className="ResetButton" onClick={this.handleReset}>Reset</Button>
                </div>
            );
        }
    }

    render(){
        var Label = ["Upload Your File", "Adjust Parameters", "Result"];
        return(
            <div className="Root">
                <AppBar className="AppBar" position="static">
                    <Toolbar className="Toolbar" variant="dense">
                        <RedditIcon className="RedditIcon" style={{ fontSize: 60 }}/>
                        <Typography variant="h4" color="inherit">
                            KMeans Download
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {Label.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {this.renderInfo()}
                </div>
            </div>
        );
    }
}

export default App;