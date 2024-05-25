import React, { SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import googleMeet from "../../../public/image/google-meet-logo.png";
import { FaRegEye } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useRouter } from "next/navigation";

type EventDetailModalProps = {
  id: string;
  activeEventModal: string;
  setActiveEventModal: React.Dispatch<SetStateAction<undefined>>;
  position: {
    x: number;
    y: number;
  };
  setPosition: React.Dispatch<SetStateAction<{ x: number; y: number }>>;
};

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  id,
  activeEventModal,
  setActiveEventModal,
  position,
  setPosition,
}) => {
  const closeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log(activeEventModal?.id);

  useEffect(() => {
    try {
      const fetchEvent = async () => {
        const { data } = await axios.get(
          `http://192.168.3.23:8000/calendar_app/api/calendar_meeting?id=${activeEventModal?.id}`
        );

        setEventData(data);
      };
      fetchEvent();
    } catch (error) {
      console.log(error);
    }
  }, [activeEventModal]);

  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (closeRef.current && !closeRef.current.contains(event.target)) {
        // setWidth("0px");
        setActiveEventModal(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setActiveEventModal]);

  return (
    <div>
      {activeEventModal?.id && (
        <div
          className="fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black/40 z-10 backdrop-blur-sm transition-all duration-200"
          // onClick={() => setActiveEventModal(false)}
        >
          <div
            className="fixed bg-white p-6 bg-dropdown-background z-100 min-w-[40%] shadow-xl rounded-xl"
            // style={{ top: position.y, left: position.x }}
            ref={closeRef}
          >
            <div className="border-2 p-1 grid grid-cols-2 gap-2">
              <div className=" col-span-1 space-y-6 border-r p-2">
                <div className="flex items-center justify-start gap-1">
                  <p className="font-semibold">Interview With :</p>
                  <p>
                    {eventData?.user_det?.candidate?.candidate_firstName}
                    &nbsp;
                    {eventData?.user_det?.candidate?.candidate_lastName}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1">
                  <p className="font-semibold">Position :</p>
                  <p>{eventData?.user_det?.job_id?.jobRequest_Title}</p>
                </div>
                {/* <div className="flex items-center justify-start gap-1">
                    <p className="font-semibold">Title :</p>
                    <p>{activeEventModal?.title}</p>
                  </div> */}
                <div className="flex items-center justify-start gap-1">
                  <p className="font-semibold">Created By :</p>
                  <p>
                    {eventData?.job_id?.jobRequest_createdBy?.firstName}
                    &nbsp;
                    {eventData?.job_id?.jobRequest_createdBy?.lastName}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1">
                  <p className="font-semibold">Interview Date :</p>
                  {eventData?.start && (
                    <p>{format(eventData?.start, "yyyy-MM-dd")}</p>
                  )}
                </div>
                <div className="flex items-center justify-start gap-1">
                  <p className="font-semibold">Interview Time :</p>
                  {eventData?.start && (
                    <>
                      <p>{format(eventData?.start, "hh:mm")}</p> -
                      <p>{format(eventData?.end, "hh:mm")}</p>
                    </>
                  )}
                </div>
                <p className="font-semibold">Interview View Google Meet</p>
                <a
                  className="p-3 border-blue-500 border-2 rounded-md flex items-center justify-between"
                  href={`http://192.168.3.23:8000/${eventData?.user_det?.candidate?.candidate_resume}`}
                  target="_blank"
                >
                  <p className="text-blue-500">Resume.doc</p>
                  <div className="flex items-center justify-center gap-3">
                    <FaRegEye className="w-6 h-6 text-blue-500" />

                    <FiDownload className="w-6 h-6 text-blue-500 cursor-pointer" />
                  </div>
                </a>
                <div
                  className="p-3 border-blue-500 border-2 rounded-md flex items-center justify-between"
                  // href={`http://192.168.3.23:8000/${eventData?.user_det?.candidate?.candidate_resume}`}
                  // target="_blank"
                >
                  <p className="text-blue-500">Aadharcard</p>
                  <div className="flex items-center justify-center gap-3">
                    <FaRegEye className="w-6 h-6 text-blue-500" />

                    <FiDownload className="w-6 h-6 text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex-col p-2 flex items-center justify-center">
                <div className="">
                  <Image
                    src={googleMeet}
                    alt="#gmeet"
                    width={150}
                    height={150}
                  />
                </div>
                <a
                  target="_blank"
                  href={eventData?.link}
                  className="px-3 py-2 rounded-md bg-[#0a66c2] text-lg text-white"
                >
                  Join
                </a>
              </div>
            </div>
            {/* <div className="border-2 p-2">Start: {activeEventModal?.start}</div>
              <div className="border-2 p-2">End: {activeEventModal?.end}</div> */}
          </div>
        </div>
      )}
    </div>
  );
};
