import React, { useRef, useState, useMemo } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styled from "styled-components";

// Layout
const Container = styled.div`
  display: grid;
  place-items: center;
  padding: 32px 16px;
  min-height: 100%;
`;

const Card = styled.div`
  width: 100%;
  max-width: 980px;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
  border: 1px solid var(--card-border);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const Header = styled.header`
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.2));
  border-bottom: 1px solid rgba(255,255,255,0.18);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  letter-spacing: .2px;
`;

const Content = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Left: form
const Panel = styled.div`
  background: var(--card-glass);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: var(--radius);
  padding: 18px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 14px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: .4px;
`;

const Field = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-size: 12px;
  color: var(--muted);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  color: var(--text);
  outline: none;
  transition: var(--transition);
  &:focus {
    border-color: var(--primary);
    box-shadow: var(--ring);
  }
  &::placeholder {
    color: #9aa6b2;
  }
`;

// Right: camera panel
const CameraWrap = styled.div`
  position: relative;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
`;

const GlassOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(500px 380px at 10% 10%, rgba(255,255,255,0.10), transparent 60%),
              linear-gradient(180deg, transparent, rgba(0,0,0,0.12) 80%);
`;

const WebcamBox = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 14px;
`;

const Button = styled.button`
  appearance: none;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled {
    opacity: .5; cursor: not-allowed; transform: none;
  }
`;

const GhostButton = styled(Button)`
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
`;

const SuccessButton = styled(Button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

// Footer actions
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px 20px 20px;
`;

// Small chip
const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  font-size: 12px;
  color: var(--muted);
`;

// Main component
export default function Register() {
  const webcamRef = useRef(null);
  const [form, setForm] = useState({ employee_id: "", name: "" });
  const [imgSrc, setImgSrc] = useState(null); // captured base64
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [existingEmployee, setExistingEmployee] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // 'user' | 'environment'
  const mirrored = facingMode === "user";
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const videoConstraints = useMemo(() => ({
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  }), [facingMode]);

  // Lookup employee when ID changes
  React.useEffect(() => {
    const fetchEmployee = async () => {
      const eid = form.employee_id.trim();
      if (!eid) {
        setExistingEmployee(null);
        return;
      }

      try {
        setLookupLoading(true);
        const res = await axios.get(`${HRbaseurl}employees/${eid}/`);
        setExistingEmployee(res.data);
        // Auto-fill name if it's currently empty or belongs to previous lookup
        setForm(prev => ({ ...prev, name: res.data.name }));
      } catch (err) {
        setExistingEmployee(null);
        // If not found, we don't necessarily want to clear the name if user is typing a new one
      } finally {
        setLookupLoading(false);
      }
    };

    const timer = setTimeout(fetchEmployee, 600); // debounce
    return () => clearTimeout(timer);
  }, [form.employee_id, HRbaseurl]);

  const capture = () => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot(); // base64
    if (!shot) return alert("Allow camera and ensure video is visible.");
    setImgSrc(shot);
  };

  const retake = () => setImgSrc(null);

  const flipCamera = () => {
    setImgSrc(null);
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  };

  const handleApprove = async () => {
    if (!existingEmployee) return;
    try {
      setLoading(true);
      await axios.post(`${HRbaseurl}employees/${existingEmployee.employee_id}/enable_face/`);
      alert("✅ Employee approved successfully!");
      // Refresh lookup
      const res = await axios.get(`${HRbaseurl}employees/${existingEmployee.employee_id}/`);
      setExistingEmployee(res.data);
    } catch (err) {
      alert("❌ Failed to approve employee");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const imageSrc = imgSrc || webcamRef.current?.getScreenshot();
    if (!imageSrc) return alert("Please capture an image first.");
    if (!form.employee_id?.trim() || !form.name?.trim()) {
      return alert("Please enter Employee ID and Name.");
    }
    try {
      setLoading(true);
      const payload = {
        employee_id: form.employee_id.trim(),
        name: form.name.trim(),
        image: imageSrc, // base64 data URL
      };
      const res = await axios.post(
        `${HRbaseurl}register/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(`✅ Registered/Updated successfully: ${res.data.name}`);
      setForm({ employee_id: "", name: "" });
      setImgSrc(null);
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        "Registration failed";
      alert(`❌ ${msg}`);
      setImgSrc(null);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.employee_id.trim() && form.name.trim() && (imgSrc || webcamRef.current);

  return (
    <>
      <Container>
        <Card>
          <Header>
            <Title>Employee Registration / Face Update</Title>
          </Header>

          <Content>
            <Panel>
              <PanelTitle>Employee Details</PanelTitle>
              <Field>
                <Label>Employee ID</Label>
                <Input
                  placeholder="e.g. EMP00123"
                  value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                />
              </Field>
              <Field>
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Ananya Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Chip>
                {lookupLoading ? "Checking ID..." : (
                  existingEmployee 
                    ? (existingEmployee.is_registered_face ? "Employee Registered in HR" : "Found in Global Profile")
                    : "Enter ID to Register New or Update Existing"
                )}
              </Chip>

              {existingEmployee && (
                <div style={{ marginTop: 20 }}>
                  <PanelTitle>
                    {existingEmployee.is_registered_face ? "Current Registered Image (HR)" : "Global Profile Image"}
                  </PanelTitle>
                  <CameraWrap style={{ height: 200, background: 'rgba(0,0,0,0.2)', border: existingEmployee.is_registered_face ? '2px solid var(--ok)' : '2px dashed var(--muted)' }}>
                    {existingEmployee.image_preview ? (
                      <img src={existingEmployee.image_preview} alt="Existing" style={{ objectFit: 'contain' }} />
                    ) : (
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>No image registered</div>
                    )}
                  </CameraWrap>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Chip style={{ borderColor: existingEmployee.is_active ? 'var(--ok)' : 'var(--err)', color: existingEmployee.is_active ? 'var(--ok)' : 'var(--err)' }}>
                        {existingEmployee.is_active ? "Status: Active" : "Status: Inactive"}
                      </Chip>
                    </div>
                    {!existingEmployee.is_active && existingEmployee.is_registered_face && (
                      <SuccessButton onClick={handleApprove} disabled={loading}>
                        Approve Now
                      </SuccessButton>
                    )}
                  </div>
                  {existingEmployee.message && !existingEmployee.is_registered_face && (
                    <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '8px', fontWeight: 600 }}>
                      ℹ️ {existingEmployee.message}
                    </div>
                  )}
                </div>
              )}
            </Panel>

            <div>
              <Panel style={{ paddingBottom: 12 }}>
                <PanelTitle>Webcam</PanelTitle>
                <CameraWrap>
                  <WebcamBox>
                    {imgSrc ? (
                      <img src={imgSrc} alt="Captured" />
                    ) : (
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        mirrored={mirrored}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={0.92}
                        videoConstraints={videoConstraints}
                      />
                    )}
                  </WebcamBox>
                  <GlassOverlay />
                </CameraWrap>

                <Controls>
                  {!imgSrc ? (
                    <>
                      <Button onClick={capture}>Capture Photo</Button>
                      <GhostButton onClick={flipCamera}>
                        Flip Camera ({facingMode === "user" ? "Front" : "Back"})
                      </GhostButton>
                    </>
                  ) : (
                    <>
                      <Button onClick={retake}>Retake</Button>
                      <GhostButton onClick={flipCamera}>
                        Flip Camera ({facingMode === "user" ? "Front" : "Back"})
                      </GhostButton>
                    </>
                  )}
                  {imgSrc && <Chip>Photo ready to submit</Chip>}
                </Controls>
              </Panel>
            </div>
          </Content>

          <Footer>
            <DangerButton onClick={() => { setForm({ employee_id: "", name: "" }); setImgSrc(null); }}>
              Reset
            </DangerButton>
            <SuccessButton onClick={handleRegister} disabled={!canSubmit || loading}>
              {loading ? "Processing..." : "Register / Update"}
            </SuccessButton>
          </Footer>
        </Card>
      </Container>
    </>
  );
}
