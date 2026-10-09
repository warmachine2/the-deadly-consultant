# Architecture rules

- Keep Student Intake validation and password-digest verification in a focused library module so submission requirements can be tested independently of rendering.
- Treat the shared-password session gate as a convenience screen, not authorization; private resume access remains controlled by database and storage policies.