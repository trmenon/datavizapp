import React, { Component} from "react";
import config from "../../constants/config.json";
import Chart from "react-apexcharts";
import { createProductList,} from './utils';


// Services import
import { getData } from "../../services/api";

// Material UI imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';


class MainComponent extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            username: "",
            nameInput:"",
            data: [],
            tableData: [],
            selectedRevenueType: "(All)",
            graphData: {
                selectedYear: 0,
                data: [],
                parameter: "revenue"
            }
        };
    }

    componentDidMount() {
        getData().subscribe({
            next: (response)=> {
                if(response && Array.isArray(response)) {
                    const initialYear = response.reduce((previous, current)=> {
                        return parseInt(previous?.year) < parseInt(current.year) ? previous?.year : current?.year;
                    });
                    
                    this.setState({
                        ...this.state, 
                        data: response.map((element)=> {
                            return {
                                id: element?.S_no,
                                line_of_business: element?.line_of_business,
                                revenue_type: element?.revenue_type,
                                product: element?.product,
                                posting_period: `${element?.month}- ${element?.year}`,
                                acv: element?.acv,
                                tcv: element?.tcv,
                                revenue: element?.revenue,
                            }
                        }),
                        tableData: response.map((element)=> {
                            return {
                                id: element?.S_no,
                                line_of_business: element?.line_of_business,
                                revenue_type: element?.revenue_type,
                                product: element?.product,
                                posting_period: `${element?.month}- ${element?.year}`,
                                acv: element?.acv,
                                tcv: element?.tcv,
                                revenue: element?.revenue,
                            }
                        }),
                        graphData: {
                            ...this.state.graphData,
                            selectedYear: initialYear,
                            data: createProductList(response, initialYear)
                        }
                    });
                }
            },
            error: (error)=> {console.log(error)},
        })
        
    }

    componentDidUpdate() {
        console.log("Component updated");
    }

    handleModalClose = () => {
        if(this.state.nameInput.length !== 0) {
            const enteredName = this.state.nameInput;
            this.setState({
                ...this.state, 
                username: enteredName, 
                nameInput: "",                
            });
        }
    };

    handleRevenueTypeSelect = (event)=> { 
        let newset= [];
        let graphMappingData = [];
        if(event.target.value !== "(All)") {
            newset = this.state.data.filter((element)=> {
                return element?.revenue_type === event.target.value;
            })
            graphMappingData = newset.map((element)=> {
                
                const posting_period_list = element.posting_period.split("-");
                return {
                    id: element?.S_no,
                    line_of_business: element?.line_of_business,
                    revenue_type: element?.revenue_type,
                    product: element?.product,
                    month: posting_period_list[0],
                    year: posting_period_list[1].split(" ")[1],
                    acv: element?.acv,
                    tcv: element?.tcv,
                    revenue: element?.revenue,
                }
            })
        }
        this.setState({
            ...this.state, 
            selectedRevenueType: event.target.value,
            tableData: event.target.value !== "(All)"? newset: this.state.data,
            graphData: {
                ...this.state.graphData,
                data: event.target.value !== "(All)"? 
                    createProductList(graphMappingData, this.state.graphData.selectedYear)
                    : this.state.graphData.data
            }
        });
    }

    handlePropertyTypeSelector = ((event)=> {
        this.setState({
            ...this.state,
            graphData: {
                ...this.state.graphData,
                parameter: event.target.value
            }
        })
    })

    render() {
        return(
            <React.Fragment>
                {/* Modal to get username */}
                <Dialog
                    open={this.state.username.length === 0? true: false}
                    // onClose={this.handleModalClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>New User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your name to continue
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(event)=> {
                                this.setState({...this.state, nameInput: event.target.value})
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            disabled= {this.state.nameInput.length === 0? true: false}
                            onClick={this.handleModalClose}
                        >
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Fixed components */}
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Select
                                labelId="revenue-type-select-label"
                                id="revenue-type-select"
                                value={this.state.selectedRevenueType}
                                label="Revenue Type"
                                onChange={this.handleRevenueTypeSelect}
                                // sx={{ flexGrow: 0 }}
                            >
                                {config.revenueType.map((element)=> {
                                        return(
                                            <MenuItem 
                                                key={element?.key}
                                                value={element?.name}
                                            >
                                                {element?.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
                            >
                                {`Hi, ${this.state.username.length === 0? "Unnamed User": this.state.username}`}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    
                </Box>
                <Box 
                    sx={{
                        my: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed grey',
                        mx: {xs: 0, md: '180px'},
                        p: 2
                    }}
                >
                    <Stack spacing={0} >
                        
                        <Select
                            labelId="property-type-select-label"
                            id="property-type-select"
                            variant = "standard"
                            value={this.state.graphData.parameter}
                            label="property Type"
                            onChange={this.handlePropertyTypeSelector}
                            sx={{my: 2}}
                        >
                            {
                                config.chart.property_type.map((element)=> {
                                    return(
                                        <MenuItem 
                                            key={element?.key}
                                            value={element?.value}
                                        >
                                            {element?.name}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                            
                    
                    
                        <Chart
                            options={config.chart.options}
                            series={this.state.graphData.data.map((element)=> {
                                return {
                                    name: element?.product,
                                    data: element.data.map((ele)=> {
                                        return ele[`${this.state.graphData.parameter}`]
                                    })
                                }
                            })}
                            type="line"
                            width="500"
                        />
                    </Stack>
                </Box>
                    <Box 
                        sx={{
                            my: 2, 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed grey',
                            mx: {xs: 0, md: '180px'},
                            p: 2
                        }}
                    >
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={this.state?.tableData}
                                columns={config.tableHeader}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>                        
                    </Box>
            </React.Fragment>
        )
    }
}

export default MainComponent;