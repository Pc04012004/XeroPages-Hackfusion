# Generated by Django 5.1.6 on 2025-02-22 20:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('login', '0009_alter_custom_user_role'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ClassCoordinator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField(choices=[('Admin', 'Administration'), ('CSE', 'Computer Science and Engineering'), ('ECE', 'Electronics and Communication Engineering'), ('EEE', 'Electrical and Electronics Engineering'), ('ME', 'Mechanical Engineering'), ('CE', 'Civil Engineering'), ('IT', 'Information Technology'), ('Mathematics', 'Mathematics')], max_length=100)),
                ('year', models.IntegerField()),
                ('section', models.CharField(blank=True, max_length=10, null=True)),
                ('coordinator_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('available_start_time', models.TimeField()),
                ('available_end_time', models.TimeField()),
                ('available_start_time_afternoon', models.TimeField()),
                ('available_end_time_afternoon', models.TimeField()),
                ('doc', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('is_approved', models.BooleanField(default=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='login.studentprofile')),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doctorbooking.doctor')),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('details', models.TextField()),
                ('bed_rest', models.BooleanField(default=False)),
                ('appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='doctorbooking.appointment')),
            ],
        ),
    ]
