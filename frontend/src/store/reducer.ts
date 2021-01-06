import { ServiceResponseMapper, SummaryResponseMapper } from './../util/service-helper.util';
import GlobalActions from "./actions.enum";

const rootreducer = (state: any, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case GlobalActions.UPDATE_THEME:
            return { ...state, isDarkThemed: !state.isDarkThemed };
        case GlobalActions.UPDATE_SERVICE:
            const _newState = ServiceResponseMapper(state, payload.services)
            return { ...state, ..._newState };
         case GlobalActions.UPDATE_SUMMARY:
            const _summary = SummaryResponseMapper(state)
            return { ...state, summaryReport: _summary };
        case GlobalActions.UPDATE_STARTTIME:
            return { ...state, summaryReport: { ...state.summaryReport, startedAt: payload.startedAt } };
        default:
            return state;
    }
};

export default rootreducer;