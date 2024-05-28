import { format } from "date-fns";
import React, { Dispatch, SetStateAction } from "react";
import { Views } from "react-big-calendar";

type DisplayMultipleEventsProps = {
  event: {};
  setView: Dispatch<SetStateAction<"month">>;
  setSelectedDate: Dispatch<SetStateAction<null>>;
  setDate: Dispatch<SetStateAction<Date>>;
};

const DisplayMultipleEvents: React.FC<DisplayMultipleEventsProps> = ({
  event,
  setView,
  setSelectedDate,
  handleNavigate,
  setDate,
}) => {
  return (
    <div
      className="drop-shadow-lg p-[10px] rounded-md border-l-[20px] hover:bg-[#0A66C2] border-[#0A66C2] group"
      onClick={() => {
        setView(Views.DAY);
        handleNavigate(event?.data?.start);
        setSelectedDate(null);
      }}
    >
      <p className="font-bold text-xs group-hover:text-white">
        {event?.data?.user_det?.job_id?.jobRequest_Title}
      </p>
      <p className="text-xs group-hover:text-white">
        {event.start.toLocaleString()}
      </p>
      <div className="flex items-center justify-start gap-1">
        <p className="text-xs group-hover:text-white">Timing :</p>
        {event?.data?.start && (
          <>
            <p className="text-xs group-hover:text-white">
              {format(event?.data?.start, "hh:mm")}
            </p>{" "}
            -
            <p className="text-xs group-hover:text-white">
              {format(event?.data?.end, "hh:mm")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayMultipleEvents;
