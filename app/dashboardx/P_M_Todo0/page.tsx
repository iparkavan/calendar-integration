"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";

import {
  Calendar,
  momentLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";

import "./style.css";

import SideMenu from "@/app/dashboard/component/SideMenu";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar styles
import axios from "axios";
import { start } from "repl";
import googleMeet from "../../../public/image/google-meet-logo.png";
import Image from "next/image";
import { EventDetailModal } from "@/app/dashboard/component/EventDetailModal";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function P_M_Todo0() {
  const dispatch = useDispatch();

  const myEventsList = [
    {
      title: "Event 1",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  ];
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [activeEventModal, setActiveEventModal] = useState();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // const [events, setEvents] = useState(myEventsList);
  const [events, setEvents] = useState([]);

  // const closeSearchRef = useRef<HTMLDivElement>(null);

  // Define months and years
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    // Add more years as needed
  ];

  const { defaultDate, formats } = useMemo(
    () => ({
      defaultDate: new Date(new Date().setHours(new Date().getHours() + 1)),
      formats: {
        dateFormat: "d",
        weekdayFormat: (
          date: any,
          culture: any,
          localizer: { format: (arg0: any, arg1: string, arg2: any) => any }
        ) => localizer.format(date, "EEEE", culture),
        dayFormat: (
          date: any,
          culture: any,
          localizer: { format: (arg0: any, arg1: string, arg2: any) => any }
        ) => localizer.format(date, "EEEE d", culture),
        timeGutterFormat: (
          date: any,
          culture: any,
          localizer: { format: (arg0: any, arg1: string, arg2: any) => any }
        ) => localizer.format(date, "hh:mm a", culture),
      },
    }),
    []
  );

  // Handle month and year changes
  const handleMonthChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedYear(e.target.value);
  };

  const handleSelectSlot = (event: any) => {
    if (typeof event.start === "string") {
      event.start = new Date(event.start);
    }

    if (typeof event.end === "string") {
      event.end = new Date(event.end);
    }

    setActiveEventModal(event);
  };

  const handleSelect = (event: any, e: { clientX: any; clientY: any }) => {
    const { start, end } = event;
    console.log("days", start, end);
    // console.log(event);
    setActiveEventModal(event);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  // Custom Event Component
  const CustomEvent = ({ event }: any) => {
    const lookup = {};

    for (let date of events) {
      lookup[format(date?.start, "yyyy-MM-dd")]
        ? (lookup[format(date?.start, "yyyy-MM-dd")] += 1)
        : (lookup[format(date?.start, "yyyy-MM-dd")] = 1);
    }

    let count: number;

    Object.entries(lookup).map((event) => {
      count = event[1];
    });

    // console.log("LOOKUP", count);
    return (
      <div className="calendarTopSection ">
        {count >= 2 && (
          <div className="bg-[#ffce47] absolute -top-2 -right-2 rounded-full w-5 h-5 items-center flex justify-center z-100 text-black text-sm ">
            {count}
          </div>
        )}

        {/* {count >= 2 && ? (
          
        )} */}
        <ul className="">
          <li className="font-bold text-xs group-hover:text-white">
            {event.title}
          </li>
          <li className="text-xs group-hover:text-white">
            {event.start.toLocaleString()}
          </li>
        </ul>
      </div>
    );
  };

  useEffect(() => {
    try {
      if (selectedMonth && selectedYear) {
        const fetchEvents = async () => {
          const { data } = await axios.get(
            `http://192.168.3.23:8000/calendar_app/api/calendar?from_date=${selectedYear}-${selectedMonth}-01&to_date=${selectedYear}-${selectedMonth}-30`
          );

          const dataEvents = data.map(
            (item: {
              id: any;
              start: string | number | Date;
              end: string | number | Date;
              desc: any;
            }) => ({
              start: new Date(item.start),
              end: new Date(item.end),
              title: item.desc,
              data: item,
              id: item.id,
            })
          );

          setEvents(dataEvents);
        };
        fetchEvents();
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedMonth, selectedYear]);

  return (
    <section className="">
      <div className="container-fluid my-md-5 my-4">
        <div className="row">
          <div className="col-lg-1 leftMenuWidth ps-0 position-relative">
            <SideMenu />
          </div>

          <div className="col-lg-11 pe-lg-4 ps-lg-0">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-8 projectText">
                <h1>Calendar</h1>
                <p className="mt-3">
                  Enjoy your selecting potential candidates Tracking and
                  Management System.
                </p>
              </div>

              <div className="col-lg-4 mt-3 mt-lg-0 text-center text-lg-end">
                <Link
                  prefetch
                  href="/P_M_JobDescriptions1"
                  className="btn btn-light me-3 mx-lg-2"
                >
                  JD Assets
                </Link>
                <Link
                  prefetch
                  href="P_M_JobDescriptions4"
                  className="btn btn-blue bg-[#0a66c2!important]"
                >
                  Create New JD
                </Link>
              </div>
            </div>

            <div className="TotalEmployees shadow bg-white rounded-3 p-3 w-100 mt-4">
              <div className="md:flex align-items-center">
                <h3 className="projectManHeading">Your Todo’s</h3>
                <div className="ml-auto d-flex todoHeadingSelect">
                  <div className="month-year-picker">
                    <select value={selectedMonth} onChange={handleMonthChange}>
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select value={selectedYear} onChange={handleYearChange}>
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="d-none d-lg-block "
                style={{ width: "100%", position: "relative" }}
              >
                <Calendar
                  startAccessor="start"
                  className="TodoDataTable"
                  selectable
                  localizer={localizer}
                  events={events}
                  endAccessor="end"
                  style={{ height: 600 }}
                  // defaultView={"week"}
                  timeslots={4} // number of per section
                  step={15}
                  views={{ month: true, week: true, day: true }} // Show only month, week, and day views
                  components={{ event: CustomEvent }}
                  // formats={{
                  //   dayFormat: "EEEE", // day labels
                  // }}
                  formats={formats}
                  defaultDate={defaultDate}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeEventModal && (
        <EventDetailModal
          id={activeEventModal?.data?.id}
          activeEventModal={activeEventModal}
          setActiveEventModal={setActiveEventModal}
          position={position}
          setPosition={setPosition}
        />
      )}
    </section>
  );
}
