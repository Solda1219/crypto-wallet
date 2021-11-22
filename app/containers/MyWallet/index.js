/**
 *
 * MyWallet
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
import { Button, List, ListItem } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import messages from './messages';
import saga from './saga';
import reducer from './reducer';
import makeSelectMyWallet from './selectors';

import Images from '../../components/uiStyle/Images';

// icons
import WalletAction from '../../images/icon/action/wallet-action.png';
import GroupAction from '../../images/icon/action/group-action.png';
import ShareAction from '../../images/icon/action/share-action.png';
import KeyAction from '../../images/icon/action/key-action.png';

import './style.scss';
import AddWallet from '../../components/AddWallet';
import MoveCoin from '../../components/MoveCoin';
import { isAmount } from '../../utils/commonFunctions';
import SingleWallet from '../SingleWallet';
import { toast } from 'react-toastify';
import SingleWalletDeposite from '../SingleWalletDeposite';
import SingleWalletWithdraw from '../SingleWalletWithdraw';
import SingleWalletActivity from '../SingleWalletActivity';


function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class MyWallet extends React.Component {
  state = {
    awModalOpen: false,
    wallet_name: '',
    mcModalOpen: false,
    sender_account: '',
    reciver_account: '',
    amount: '',
    row: [],
    currentPage: 1,
    rowsPerPage: 4,
    pageNumberOfPage: 1,
    walletView: 'all-wallet',
    selectedWallet: {},
    tab: 0,
  };

  awHandleClickOpen = () => {
    this.setState({ awModalOpen: true });
  };

  awModalCloseHandler = () => {
    this.setState({
      awModalOpen: false,
    });
  };


  mcModalCloseHandler = () => {
    this.setState({
      mcModalOpen: false,
    });
  };

  mcChangeHandler = e => {
    if (e.target.name === 'amount') {
      if (isAmount(e.target.value)) {
        this.setState({ [e.target.name]: e.target.value });
      }
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  mcSubmitHandler = e => {
    e.preventDefault();

    const {wallet_name, sender_account, reciver_account} = this.state;

    if (amount === '' || sender_account === '' || reciver_account === ''){
      toast.error("Please give a valid info!")
    } else {
      this.setState({
        mcModalOpen: false,
        sender_account: '',
        reciver_account: '',
        amount: '',
      });
      toast.success("Coin Moved Successfully!");
    }


  };

  paginateHandler = prop => event => {
    this.setState({
      currentPage: Number(event.target.id),
      pageNumberOfPage: prop,
    });
  };

  walletViewHandler = (row, tab) => e => {
    this.setState({
      walletView: 'single-wallet',
      selectedWallet: row,
      tab,
    });
  };

  viewAllWalletOpenHandle = () => {
    this.setState({
      walletView: 'all-wallet',
    });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { classes } = this.props;

    const {
      row,
      currentPage,
      rowsPerPage,
      pageNumberOfPage,
      awModalOpen,
      mcModalOpen,
      wallet_name,
      sender_account,
      reciver_account,
      amount,
      walletView,
      selectedWallet,
      tab,
    } = this.state;

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
      <Grid className="myWalletWrapper">
        <Grid className="container">
          <AppBar className="walletTabsBar" position="static" color="default">
            {/* <Typography className="sWalletTitle" component="p">
              {row.name}
            </Typography> */}
            <Tabs
              value={tab}
              onChange={this.tabChangeHandler}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              className="tabsWrapper"
            >
              <Tab
                disableRipple
                label="Deposite"
                icon={<Images src={WalletAction} />}
              />
              <Tab
                disableRipple
                label="Withdraw"
                icon={<Images src={ShareAction} />}
              />
              <Tab
                disableRipple
                label="Activity"
                icon={<Images src={GroupAction} />}
              />
            </Tabs>
            {/* <Button className="btn btnBlue" onClick={viewAllWalletOpenHandle}>
              <FontAwesome name="reply" />
              All Wallets
            </Button> */}
          </AppBar>
          {tab === 0 && (
            <TabContainer>
              <SingleWalletDeposite />
            </TabContainer>
          )}
          {tab === 1 && (
            <TabContainer>
              <SingleWalletWithdraw />
            </TabContainer>
          )}
          {tab === 2 && (
            <TabContainer>
              <SingleWalletActivity />
            </TabContainer>
          )}
        </Grid>
      </Grid>
    );
  }
}

MyWallet.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  myWallet: makeSelectMyWallet(),
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

const withReducer = injectReducer({ key: 'myWallet', reducer });
const withSaga = injectSaga({ key: 'myWallet', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MyWallet);
