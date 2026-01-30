import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import React from "react";
import {AdvancedImage} from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";

const ClassesShow = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query.data?.data;
  const { isLoading, isError } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader title="Class Details" resource="classes" />

        <p className="state-message">
          {isLoading
            ? "Loading class details"
            : isError
            ? "Failed  to load class details"
            : "class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown Teacher";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placeholder.com/600x400?text=${encodeURIComponent(
    teacherInitials || "N/A",
  )}&background=random&size=128&length=2`;

  const {
    id,
    name,
    description,
    status,
    capacity,
    courseCode,
    courseName,
    bannerUrl,
    bannerCldPubId,
    subject,
    teacher,
    department,
    schedules,
    inviteCode,
  } = classDetails;
  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader title="Class Details" resource="classes" />

      <div className="banner">
        {bannerUrl ? (
          (
            <AdvancedImage alt="Class banner" cldImg={bannerPhoto(bannerCldPubId ?? '', name)} /> 
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>

          <div>
            <Badge variant='outline'>{capacity} spots</Badge>
            <Badge variant={status === 'active' ? 'default' : 'secondary'} data-status={status}>{status.toUpperCase()}</Badge>
          </div>
        </div>

        <div className="details-grid">
          <div className="instructor">
            <p>Instructor</p>
            <div>
              <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

              <div>
                <p>{teacherName}</p>
                <p>{teacher?.email}</p>
              </div>
            </div>
          </div>

        <div className="department">
            <p>Department</p>

            <div>
              <p>{department?.name}</p>
              <p>{department?.description}</p>
            </div>
        </div>
        </div>
        <Separator />

        <div className="subject">
          <p>Subject</p>

          <div>
            <Badge variant='outline'>Code: {subject?.code}</Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        <div className="join">
          <h2>Join class</h2>
          <ol>
            <li>Ask your teacher for the Invite code</li>
            <li>Click on join class button</li>
            <li>Paste the code you received and click join</li>
          </ol>
        </div>

        <Button size='lg' className="w-full">
          Join Class
        </Button>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
