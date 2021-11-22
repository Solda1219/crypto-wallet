/**
 *
 * Referral
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  Button,
  List,
  ListItem,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TableBody from '@material-ui/core/TableBody';

import makeSelectReferral from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import './style.scss';
import Image from '../../components/uiStyle/Images';
import Form from '../../components/uiStyle/Form';

import RefShareIcon from '../../images/icon/ref-share.png';
import RefSendIcon from '../../images/icon/ref-send.png';
import FontAwesome from '../../components/uiStyle/FontAwesome';
import { validateEmail } from '../../utils/commonFunctions';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../../utils/constants';

import axios from 'axios';

const Earnings = [
  {
    period: '2019-01-31',
    commission1: '15.00000',
    commission2: '0.00000',
    p_o_commission: '0.00000',
    total: '15.00000',
  },
  {
    period: '2019-02-5',
    commission1: '15.00000',
    commission2: '0.00000',
    p_o_commission: '0.00000',
    total: '15.00087',
  },
  {
    period: '2019-02-10',
    commission1: '08.00000',
    commission2: '0.00000',
    p_o_commission: '0.00000',
    total: '56.00000',
  },
];

/* eslint-disable react/prefer-stateless-function */
export class Referral extends React.Component {
  state = {
    email: '',
    all_email: [],
    contact_link:
      'https://cryptwallet.itech-theme.com/refferal567859djdfhyf/854hgfju',
    earnings: Earnings,
    currentPage: 1,
    rowsPerPage: 10,
    pageNumberOfPage: 1,
    row: [],
    intervalId: '',
  };

  async componentDidMount(){
    await this.realTimeTopTokenInfo();
    var intervalId= setInterval( async() =>{
      console.log("time out called")
      await this.realTimeTopTokenInfo();
    }, 310000);
    this.setState({intervalId});
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  realTimeTopTokenInfo = async ()=>{
    var topTokensHistory = await this.getTopTokensHistory();
    var nowInfo= topTokensHistory[topTokensHistory.length-1].data;
    var previousInfo= topTokensHistory[0].data;
    var pairs= Object.keys(nowInfo);
    var modifiedWithPriceChange= pairs.map((pair)=>{
      try {
        var nowPrice= parseFloat(nowInfo[pair].price);
        var previousPrice= parseFloat(previousInfo[pair].price);
        var priceChange= nowPrice- previousPrice;
        var priceChangePercent= (100/previousPrice)*priceChange;
        return {...nowInfo[pair], priceChangePercent: priceChangePercent.toFixed(5)};
      }
      catch(err){
        return {...nowInfo[pair], priceChangePercent: 0.00000};
      }
    });
    this.setState({row: modifiedWithPriceChange});
  }


  getTopTokensHistory = async()=>{
    const res= await axios.get(SERVER_URL+'/api/topTokens');
    return res.data;
  }

  requireTokenImg = (address) =>{
    try {
      return require("../../images/tokens/"+address+".png");
    }
    catch (e) {
      return require("../../images/tokens/default.png");
    }
  }

  paginateHandler = prop => event => {
    this.setState({
      currentPage: Number(event.target.id),
      pageNumberOfPage: prop,
    });
  };
  
  copyHandler = e => {
    e.preventDefault();
    navigator.clipboard.writeText(this.state.contact_link);

    toast.info('Copied to clipboard');
  };

  addEmailHandle = e => {
    if (e.target.value === ',' || e.target.value === ' ') {
      return;
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  keyDownHandleAddEmail = e => {
    if (e.key === ',' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const { email } = this.state;
      const newEmails = [...this.state.all_email];

      if (!validateEmail(email)) {
        return;
      }

      if (this.state.all_email.includes(email)) {
        return;
      }

      this.setState({
        all_email: newEmails.concat(email),
        email: '',
      });
    }
  };

  focusOnEmailInput = () => {
    this.emailInput.focus();
  };

  deletHandler = prop => e => {
    const emails = [...this.state.all_email];
    const all_email = this.state.all_email.filter(
      email => email !== emails[prop],
    );

    this.setState({
      all_email,
    });
  };

  submitHandler = e => {
    e.preventDefault();

    this.setState({
      all_email: [],
    });

    if (this.state.all_email.length >= 1) {
      toast.success('Successfully invitation emial send');
    } else {
      toast.error('Add an email first');
    }
  };

  render() {
    const { contact_link, email, all_email, earnings, rowsPerPage, currentPage, pageNumberOfPage, row } = this.state;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = row.slice(indexOfFirstRow, indexOfLastRow);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(row.length / rowsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
      <ListItem
        key={number}
        id={number}
        className={pageNumberOfPage === number ? 'active' : ''}
        onClick={this.paginateHandler(number)}
      >
        {number}
      </ListItem>
    ));
    return (
      <Grid className="mainBody">
        <Grid className="container">
          {/* <Grid className="referralBody">
            <Typography component="h4" className="section-title">
              Invite Your Contact
            </Typography>
            <Grid className="singleReferral">
              <Typography component="h5" className="subTitle">
                <Image src={RefShareIcon} /> Share this link to your contact
              </Typography>
              <Typography component="p">
                Clicking this button will copy the URL to the user’s clipboard.
              </Typography>
              <Form className="copyInputText" onSubmit={this.copyHandler}>
                <Button type="submit" className="formSubmitBtn">
                  Copy URL
                </Button>
                <TextField
                  className="copyInputField"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={contact_link}
                />
              </Form>
            </Grid>
            <Grid className="singleReferral">
              <Typography component="h5" className="subTitle">
                Or
              </Typography>
              <Typography component="h5" className="subTitle">
                <Image src={RefShareIcon} /> Share your code on
              </Typography>
              <Button className="btn btnFB mr5">
                <FontAwesome name="facebook" /> Facebook
              </Button>
              <Button className="btn btnTWT">
                <FontAwesome name="twitter" /> Twitter
              </Button>
            </Grid>
            <Grid className="singleReferral">
              <Typography component="h5" className="subTitle">
                Or
              </Typography>
              <Typography component="h5" className="subTitle">
                <Image src={RefSendIcon} /> Invite your friends by your mail
              </Typography>
              <Typography component="p">
                Enter one email by line and click send.{' '}
              </Typography>
              <Form onSubmit={this.submitHandler}>
                <Grid className="emailFields" onClick={this.focusOnEmailInput}>
                  <List>
                    {all_email.map((emailid, index) => (
                      <ListItem key={index} onClick={this.deletHandler(index)}>
                        {emailid}
                        <FontAwesome name="times" />
                      </ListItem>
                    ))}
                    <TextField
                      inputRef={input => (this.emailInput = input)}
                      name="email"
                      value={email}
                      placeholder="Type Here...."
                      onChange={this.addEmailHandle}
                      onKeyDown={this.keyDownHandleAddEmail}
                    />
                  </List>
                </Grid>
                <Button className="formSubmitBtn mt3" type="submit">
                  Send
                </Button>
              </Form>
            </Grid>
          </Grid> */}
          <Grid className="referralBody mt8 pl0 pr0">
            <Typography component="h4" className="section-title">
              Top Listed Coins
            </Typography>
            <Grid className="container">
              <Grid className="myWalletBody">
                <Grid className="tableWrapper">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell style= {{width: '20%'}}>Price Change</TableCell>
                        <TableCell>Base volume</TableCell>
                        <TableCell>Quote volume</TableCell>
                        <TableCell>Liquidity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell style = {{width:"100%"}}><Image width="20px" src= {this.requireTokenImg(row.base_address)}/><Image width="20px" src= {this.requireTokenImg(row.quote_address)}/>{row.base_symbol}-{row.quote_symbol}</TableCell>
                          {/* <TableCell>{row.base_symbol}-{row.quote_symbol}</TableCell> */}
                          <TableCell>{parseFloat(row.price).toFixed(10)}</TableCell>
                          <TableCell style= {row.priceChangePercent>0?{color: "#32cda0"}:row.priceChangePercent<0?{color:"#eb4aa1"}:{color:"#eb4aa1"}}>{row.priceChangePercent}%</TableCell>
                          <TableCell>{parseFloat(row.base_volume).toFixed(4)}</TableCell>
                          <TableCell>{parseFloat(row.quote_volume).toFixed(4)}</TableCell>
                          <TableCell>{parseFloat(row.liquidity).toFixed(4)}</TableCell>
                          {/* <TableCell>
                            <List className="actionBtns">
                              <ListItem onClick={this.walletViewHandler(row, 0)}>
                                <Images src={WalletAction} />
                              </ListItem>
                              <ListItem onClick={this.walletViewHandler(row, 1)}>
                                <Images src={GroupAction} />
                              </ListItem>
                              <ListItem onClick={this.walletViewHandler(row, 2)}>
                                <Images src={ShareAction} />
                              </ListItem>
                              {row.id === 2 ? (
                                <ListItem>
                                  <Images src={KeyAction} />
                                </ListItem>
                              ) : (
                                ''
                              )}
                            </List>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              <Grid className="PaginationWrapper">
                <List>{renderPageNumbers}</List>
              </Grid>
            </Grid>
          </Grid>
          <Grid className="referralBody mt8">
            <Typography component="h4" className="section-title">
              My Earnings
            </Typography>
            <Grid className="myEarnings mt4">
              <Grid className="tableWrapper">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Commission 1</TableCell>
                      <TableCell>Commission 2</TableCell>
                      <TableCell>Card pre-order commission</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earnings.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.period}</TableCell>
                        <TableCell>{row.commission1}</TableCell>
                        <TableCell>{row.commission2}</TableCell>
                        <TableCell>{row.p_o_commission}</TableCell>
                        <TableCell>{row.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        Total earnings :
                      </TableCell>
                      <TableCell>86.00087</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Referral.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  referral: makeSelectReferral(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'referral', reducer });
const withSaga = injectSaga({ key: 'referral', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Referral);
