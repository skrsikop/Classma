import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants'
import { UploadWidgetValue } from '@/types'
import { UploadCloud } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (payload: UploadWidgetValue) => void;
  disabled?: boolean;
}

const UploadWidget: 
    React.FC<UploadWidgetProps> = ({ 
      value = null, 
      onChange, 
      disabled = false 
    }) =>  {

  // widget ref  & onChange ref
    const widgetRef = useRef<CloudinaryWidget | null>(null)
    const onChangeRef = useRef(onChange)
  // states
    const [preview , setPreview] = useState<UploadWidgetValue | null>(value)

  // open widget function
    const openWidget = () => {
        if(!disabled) widgetRef.current?.open();
    }

    // useEffects
    useEffect(()=> {
      setPreview(value);
      if(!value) {
      }
    }, [value])

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
      if (typeof window === "undefined") return;

      const initializeWidget = () => {
        if(!window.cloudinary || widgetRef.current) return false;

        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET, // UNSIGNED
            multiple: false,
            folder: "uploads",
            maxFileSize: 5000000, // ✅ NUMBER
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => {
            if (!error && result.event === "success") {
              const payload = {
                url: result.info.secure_url,
                publicId: result.info.public_id,
              };

              setPreview(payload);
              onChangeRef.current?.(payload);
            }
          }
        );


        return true;
      }

      if(initializeWidget()) return;

      const intervalId = window.setInterval(() => {
        if(initializeWidget()) {
          window.clearInterval(intervalId);
        }
      }, 500);

      return () => window.clearInterval(intervalId)
    }, [])

  return (
    <div className='space-y-2'>
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />
        </div>
      ) : (
        <div 
           onClick={openWidget} 
           className="upload-dropzone"
           role="button"
           tabIndex={0}
           aria-label="Upload image"
           onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
              openWidget();
            }
          }}
          >
            <div className="upload-prompt">
              <UploadCloud className='icon' />
              <div>
                <p>Click to upload a Photo</p>
                <p>PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default UploadWidget
