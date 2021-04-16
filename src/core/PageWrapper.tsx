import * as React from "react";
import { History } from 'history';
import { ApiResult } from "./APIWrapperTypes";
//import { doEFuseCheck } from "../util/checkUpgraded";
import { toastr } from "react-redux-toastr";
import { canAccessPage } from "pages/accessControl";
import { PageName } from "pages/pageNames";

interface Props<T_URL, T_Async> {
	key: string,
	urlProps: T_URL
	component: (urlProps: T_URL, asyncProps: T_Async) => JSX.Element
	getAsyncProps?: (urlProps: T_URL) => Promise<ApiResult<T_Async>>,
	shadowComponent?: JSX.Element,
	history: History<any>,
	pageName: PageName,
}

interface State<T> {
	readyToRender: boolean,
	componentAsyncProps: T
}

function showToastr() {
	const options = {
		timeOut: 4000,
		showCloseButton: true,
		progressBar: true,
		position: "top-right"
	};

	toastr.error(
		"Access Denied",
		"You don't have access to that page.",
		options
	);
}

export default class PageWrapper<T_URL, T_Async> extends React.Component<Props<T_URL, T_Async>, State<T_Async>> {
	constructor(props: Props<T_URL, T_Async>) {
		super(props);
		const self = this

		if (!canAccessPage(this.props.pageName)) {
			this.state = {
				readyToRender: false,
				componentAsyncProps: null
			}
			showToastr();
			this.props.history.replace("/");
		} else {
			if (this.props.getAsyncProps != undefined) {
				this.state = {
					readyToRender: false,
					componentAsyncProps: null
				}
				// When API comes back, manually trigger `serverSideResolveOnAsyncComplete`
				// (if this is clientside, that fn will not do anything and that's fine)
				this.props.getAsyncProps(this.props.urlProps).then(asyncProps => {
					if (asyncProps && asyncProps instanceof Array) {
						const success = asyncProps.reduce((totalSuccess, e) => totalSuccess && e.type == "Success", true);
						if (success) {
							self.setState({
								readyToRender: true,
								componentAsyncProps: asyncProps.map(e => e.success) as unknown as T_Async
							});
						}
					} else if (asyncProps && asyncProps.type == "Success") {
						self.setState({
							readyToRender: true,
							componentAsyncProps: asyncProps.success
						});
					} else {
						// TODO: else... do something
						console.log("async error: ", asyncProps)
					}
				})
			} else {
				this.state = {
					readyToRender: true,
					componentAsyncProps: {} as T_Async
				}
			}
		}
	}
	componentDidMount() {
		window.scrollTo(0, 0)
	}
	render() {
		if (this.state.readyToRender) {
			return this.props.component(this.props.urlProps, this.state.componentAsyncProps)
		} else {
			return this.props.shadowComponent
		}
	}
}
