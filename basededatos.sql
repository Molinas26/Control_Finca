CREATE TABLE users
(
    id serial not null,
    name character varying(55) COLLATE pg_catalog."default" NOT NULL,
    email character varying(55) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE activity
(
    id serial not null,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    rate real,
    dia character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT activity_pkey PRIMARY KEY (id)
);

CREATE TABLE employee
(
    id serial not null,
    name character varying(55) COLLATE pg_catalog."default" NOT NULL,
    identity character varying(13) COLLATE pg_catalog."default" NOT NULL,
    birthday date NOT NULL,
    department_id integer NOT NULL,
    name_department character varying(55) COLLATE pg_catalog."default" NOT NULL,
    job_id integer NOT NULL,
    name_job character varying(55) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT employee_pkey PRIMARY KEY (id)
);

CREATE TABLE daily_load_finca
(
    id serial not null,
    employee_id integer NOT NULL,
    registration_date date NOT NULL,
    state boolean DEFAULT false,
    responsability integer NOT NULL,
    CONSTRAINT daily_load_finca_pkey PRIMARY KEY (id),
    CONSTRAINT daily_load_finca_employee_id_fkey FOREIGN KEY (employee_id)
        REFERENCES public.employee (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT daily_load_finca_responsability_fkey FOREIGN KEY (responsability)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.daily_load_finca_detail
(
    id serial not null,
    activity_id integer NOT NULL,
    daily_load_finca_id integer NOT NULL,
    amount integer,
    hour numeric(8,4),
    CONSTRAINT daily_load_finca_detail_pkey PRIMARY KEY (id),
    CONSTRAINT daily_load_finca_detail_activity_id_fkey FOREIGN KEY (activity_id)
        REFERENCES public.activity (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT daily_load_finca_detail_daily_load_finca_id_fkey FOREIGN KEY (daily_load_finca_id)
        REFERENCES public.daily_load_finca (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.daily_closure_finca
(
    id serial not null,
    registration_date date NOT NULL,
    responsability bigint NOT NULL,
    state boolean NOT NULL DEFAULT false,
    CONSTRAINT daily_closure_finca_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.daily_closure_finca_detail
(
    id serial not null,
    amounts integer NOT NULL,
    day_hours integer NOT NULL,
    overtime integer NOT NULL,
    production_payment double precision NOT NULL,
    hourly_pay double precision NOT NULL,
    extra_payment double precision NOT NULL,
    daily_closure_finca_id bigint,
    employee_id integer NOT NULL,
    CONSTRAINT daily_closure_finca_detail_pkey PRIMARY KEY (id)
);

INSERT INTO public.users(
	name, email, password)
	VALUES ('Admin1', 'admin1@gmail.com', '$2a$08$J8WDAUputoHg8k1gr40N/.mpRx1pY964j3vAk4K6vx11OtfBiRT0.');

